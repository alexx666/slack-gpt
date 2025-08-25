import { createInterface } from "readline/promises";
import { config } from "dotenv";

import { OpenAIAgent } from "./openai.agent";

async function main() {
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

            if (message.toLowerCase() === "quit") break;

            const response = await agent.run(message);

            console.log("\n" + response);
        } catch (e) {
            console.error("Error in chat loop:", e);
        } finally {
            rl.close();
        }
    }

    await agent.disconnect();
}

void main();