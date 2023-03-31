import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai";

const openAIConfig = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const model = String(process.env.OPENAI_MODEL);
const openai = new OpenAIApi(openAIConfig);

export async function sendChatGPTRequest(prompts: ChatCompletionRequestMessage[], systemContent?: string): Promise<string | undefined> {
    console.debug("Sending message to ChatGPT...")
    const completion = await openai.createChatCompletion({
        model, messages: [
            {
                role: ChatCompletionRequestMessageRoleEnum.System,
                content: systemContent ?? String(process.env.OPENAI_SYSTEM_CONTENT)
            },
            ...prompts,
        ]
    });

    return completion.data.choices[0].message?.content;
}