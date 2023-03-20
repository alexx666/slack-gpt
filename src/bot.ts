import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { WebClient } from "@slack/web-api";
import { Configuration, OpenAIApi } from "openai";

const openAIConfig = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const model = String(process.env.OPENAI_MODEL);

const slack = new WebClient(process.env.SLACK_TOKEN);
const openai = new OpenAIApi(openAIConfig);

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

    const response = {
        statusCode: 200,
        body: "",
    }

    if (!event.body) return response;

    const slackMessage: any = JSON.parse(event.body);

    console.log(slackMessage);

    const channel = slackMessage.event.channel;
    const prompt = slackMessage.event.text; // TODO: substitute mention

    const completion = await openai.createCompletion({ model, prompt }, { timeout: 30000 });

    const openAIResult = completion.data.choices[0].text;

    await slack.chat.postMessage({
        channel,
        text: openAIResult,
    });

    return response;
}