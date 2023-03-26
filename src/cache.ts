import { createHash } from 'crypto';

import { DynamoDB } from "aws-sdk";

const requestCache = new DynamoDB.DocumentClient();

const cacheTTL = 10 * 60; // 10 min

const cacheTable = String(process.env.DYNAMO_REQUEST_CACHE_TABLE);

export function hashRequestBody(body: any): string {
    console.debug("Generating hash from:", body)

    const hash = createHash('sha256');
    hash.update(JSON.stringify(body));
    return hash.digest('hex');
}

export async function isCached(requestId: string): Promise<boolean> {
    const result = await requestCache
        .get({ TableName: cacheTable, Key: { requestId } })
        .promise();

    return result.Item !== undefined;
}

export async function cacheRequest(requestId: string): Promise<void> {
    console.debug("Caching requestId:", requestId);
    await requestCache.put({
        TableName: cacheTable,
        Item: {
            requestId,
            ttl: Math.floor(Date.now() / 1000) + cacheTTL,
        }
    }).promise()
}