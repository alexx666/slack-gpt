import { SQS } from "aws-sdk";

const sqs = new SQS();

export async function queueMessage(request: any): Promise<void> {
    await sqs.sendMessage({
        QueueUrl: String(process.env.SQS_QUEUE_URL),
        MessageBody: JSON.stringify(request),
    }).promise();
}