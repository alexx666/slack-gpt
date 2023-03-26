import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai";

const openAIConfig = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const model = String(process.env.OPENAI_MODEL);
const openai = new OpenAIApi(openAIConfig);

const systemContent = String(process.env.OPENAI_SYSTEM_CONTENT);

export async function sendChatGPTRequest(prompts: ChatCompletionRequestMessage[]): Promise<string | undefined> {
    console.debug("Sending message to ChatGPT...")
    const completion = await openai.createChatCompletion({
        model, messages: [
            {
                role: ChatCompletionRequestMessageRoleEnum.System,
                content: systemContent
            },
            ...prompts,
        ]
    }, { timeout: 30000 });

    return completion.data.choices[0].message?.content;
}