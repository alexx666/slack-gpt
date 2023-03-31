import { sendChatGPTRequest } from "./openai";
import { getChatDescription, getChatHistory, postSlackMessage } from "./slack";

export async function handleRequest(slackMessage: any) {
    const channel = slackMessage.event.channel;
    const subtype = slackMessage.event.subtype;

    if (subtype === "channel_topic") return;

    const description = await getChatDescription(channel);
    const messages = await getChatHistory(channel);
    const response = await sendChatGPTRequest(messages, description);

    await postSlackMessage(channel, response);
}
