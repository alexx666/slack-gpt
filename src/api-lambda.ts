import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { handleRequest } from "./api";
import { getBotId } from "./slack";

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

    const successResponse = {
        statusCode: 200,
        body: "",
    };

    console.debug(event);

    if (!event.body) return {
        statusCode: 400,
        body: JSON.stringify({
            error: "Request body is empty!",
        })
    };

    const slackMessage = JSON.parse(event.body);

    console.info(slackMessage);

    if (slackMessage.challenge) return {
        statusCode: 200,
        body: slackMessage.challenge
    };

    const botInfo = await getBotId();

    if (slackMessage.event?.bot_id === botInfo.bot_id) return successResponse;

    await handleRequest(slackMessage);

    return successResponse;
}