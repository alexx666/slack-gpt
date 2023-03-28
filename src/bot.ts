import { sendChatGPTRequest } from "./openai";
import { getChatHistory, postSlackMessage } from "./slack";

export async function handleRequest(slackMessage: any) {
    const channel = slackMessage.event.channel;

    const messages = await getChatHistory(channel);
    const response = await sendChatGPTRequest(messages);

    await postSlackMessage(channel, response);
}
