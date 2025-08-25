import { Agent, run, MCPServerStdio } from '@openai/agents';

export class OpenAIAgent {
    private agent: Agent;

    constructor(
        name: string = "SlackGPT",
        model: string = String(process.env.OPENAI_MODEL),
        instructions: string = String(process.env.OPENAI_SYSTEM_CONTENT),
    ) {
        // TODO: pass configurations via file
        const notionApi = new MCPServerStdio({
            name: 'Notion API',
            fullCommand: `npx -y @notionhq/notion-mcp-server`,
            env: {
                NOTION_TOKEN: String(process.env.NOTION_TOKEN),
            },
            cacheToolsList: true,
        });

        this.agent = new Agent({
            name: name,
            model: model,
            instructions: instructions,
            mcpServers: [notionApi]
        });
    }

    public connect() {
        return Promise.all(this.agent.mcpServers.map(server => server.connect()));
    }

    public async disconnect() {
        return Promise.all(this.agent.mcpServers.map(server => server.close()));
    }

    public async run(message: string) {
        const result = await run(this.agent, message);

        return result.finalOutput;
    }
}   