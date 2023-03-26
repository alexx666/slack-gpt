import { cacheRequest, hashRequestBody, isCached } from "./cache";
import { sendChatGPTRequest } from "./openapi";
import { getChatHistory, postSlackMessage } from "./slack";

export async function handleRequest(slackMessage: any) {
    const requestId = hashRequestBody(slackMessage);

    const cached = await isCached(requestId);

    if (cached) return;

    await cacheRequest(requestId);

    const channel = slackMessage.event.channel;

    const messages = await getChatHistory(channel);
    const response = await sendChatGPTRequest(messages);

    await postSlackMessage(channel, response);
}
