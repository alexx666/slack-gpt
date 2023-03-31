import { WebClient } from "@slack/web-api";
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from "openai";

const slack = new WebClient(process.env.SLACK_TOKEN);

export async function getBotId() {
    return slack.auth.test();
}

export async function getChatHistory(channel: string) {
    console.debug("Fetching bot info and chat history...");

    const botInfo = await getBotId();

    // gets only latest
    const history = await slack.conversations.history({ channel });

    const sortedMessages = (history.messages ?? []).sort((m1, m2) => Number(m1.ts) - Number(m2.ts));

    // Maps to gpt message format
    const messages: ChatCompletionRequestMessage[] = sortedMessages.map(msg => ({
        role: msg.bot_id === botInfo.bot_id
            ? ChatCompletionRequestMessageRoleEnum.Assistant
            : ChatCompletionRequestMessageRoleEnum.User,
        content: String(msg.text)
    }));

    return messages;
}

export async function postSlackMessage(channel: string, text: string | undefined) {
    console.debug("Sending message to Slack channel...");
    await slack.chat.postMessage({ channel, text });
}

export async function getChatDescription(channel: string): Promise<string | undefined> {
    console.debug("Fetching chat info...");

    const info = await slack.conversations.info({ channel });

    return info.channel?.topic?.value;
}