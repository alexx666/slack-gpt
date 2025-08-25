import { createInterface } from "readline/promises";
import { config } from "dotenv";

import { OpenAIAgent } from "./openai.agent";

async function main() {
    process.on('SIGINT', () => console.log('\nShutting down...'));
    process.on('SIGTERM', () => console.log('\nShutting down...'));

    process.on("exit", async () => {
        await agent.disconnect();
        console.log('Exiting...');
    });

    config();

    const agent = new OpenAIAgent();

    await agent.connect();

    while (true) {
        const rl = createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        try {
            const message = await rl.question("\nQuery: ");

            const response = await agent.send(message);

            console.log("\n" + response);
        } catch (e) {
            console.error("Error in chat loop:", e);
        } finally {
            rl.close();
        }
    }
}

void main();