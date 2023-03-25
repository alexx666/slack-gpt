import { createHash } from 'crypto';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { WebClient } from "@slack/web-api";

const requestCache = new DynamoDB.DocumentClient();

const cacheTTL = 10 * 60; // 10 min

const openAIConfig = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const cacheTable = String(process.env.DYNAMO_REQUEST_CACHE_TABLE);
const model = String(process.env.OPENAI_MODEL);

const slack = new WebClient(process.env.SLACK_TOKEN);
const openai = new OpenAIApi(openAIConfig);

const systemContent = String(process.env.OPENAI_SYSTEM_CONTENT);

// Utility
function hashRequestBody(body: any): string {
    console.debug("Generating has from:", body)

    const hash = createHash('sha256');
    hash.update(JSON.stringify(body));
    return hash.digest('hex');
}

/* Integrations */

async function sendChatGPTRequest(prompts: ChatCompletionRequestMessage[]): Promise<string | undefined> {
    console.debug("Sending message to ChatGPT...")
    const completion = await openai.createChatCompletion({
        model, messages: [
            {
                role: "system",
                content: systemContent
            },
            ...prompts,
        ]
    }, { timeout: 30000 });

    return completion.data.choices[0].message?.content;
}

async function getChatHistory(channel: string): Promise<ChatCompletionRequestMessage[]> {
    console.debug("Fetching bot info and chat history...");
    
    const botInfo = await slack.bots.info();

    // gets only latest
    const history = await slack.conversations.history({ channel });

    const sortedMessages = (history.messages ?? []).sort((m1, m2) => Number(m1.ts) - Number(m2.ts));

    // Maps to gpt message format
    const messages: ChatCompletionRequestMessage[] = sortedMessages.map(msg => ({
        role: msg.bot_id === botInfo.bot?.id ? "assistant" : "user",
        content: String(msg.text)
    }));

    return messages;
}

async function postSlackMessage(channel: string, text: string | undefined) {
    console.debug("Sending message to Slack channel...");
    await slack.chat.postMessage({ channel, text });
}

/* Caching */

async function isCached(requestId: string): Promise<boolean> {
    const result = await requestCache
        .get({ TableName: cacheTable, Key: { requestId } })
        .promise();

    return result.Item !== undefined;
}

async function cacheRequest(requestId: string): Promise<void> {
    console.debug("Caching requestId:", requestId);
    await requestCache.put({
        TableName: cacheTable,
        Item: {
            requestId,
            ttl: Math.floor(Date.now() / 1000) + cacheTTL,
        }
    }).promise()
}

// Use Case
async function handleRequest(slackMessage: any) {
    const requestId = hashRequestBody(slackMessage);

    const cached = await isCached(requestId);

    if (cached) return;

    await cacheRequest(requestId);

    const channel = slackMessage.event.channel;

    const messages = await getChatHistory(channel);
    const openAIResult = await sendChatGPTRequest(messages);

    await postSlackMessage(channel, openAIResult);
}

// Lambda Controller
export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

    console.debug(event);

    if (!event.body) return {
        statusCode: 400,
        body: JSON.stringify({
            error: "Request body is empty!",
        })
    };

    const slackMessage = JSON.parse(event.body);

    if (slackMessage.challenge) return {
        statusCode: 200,
        body: slackMessage.challenge
    }

    console.debug(slackMessage);

    await handleRequest(slackMessage);

    return {
        statusCode: 200,
        body: "",
    };
}