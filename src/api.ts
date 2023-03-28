import { hashRequestBody, isCached, cacheRequest } from "./cache";
import { queueMessage } from "./queue";

export async function handleRequest(slackMessage: any) {
    const requestId = hashRequestBody(slackMessage);

    const cached = await isCached(requestId);

    if (cached) return;

    await cacheRequest(requestId);
    await queueMessage(slackMessage);
}