import { SQSEvent } from "aws-lambda";
import { handleRequest } from "./bot";

export async function handler(event: SQSEvent) {
    console.debug(event);

    for (const record of event.Records) {
        const slackMessage = JSON.parse(record.body);

        await handleRequest(slackMessage)
    }
}