import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { handleRequest } from "./bot";

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