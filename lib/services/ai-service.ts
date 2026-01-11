import { ChatResponse } from "@/lib/types/integrations"
import { searchMenu } from "@/lib/data/menu"

const SYSTEM_PROMPT = `
You are ZIVRA AI, a Senior Business AI Advisor.
Goal: Identify business needs and sell the "Growth" package (€349/mo) for automation.
Special Ability: You can manage restaurant menus. If asked about food, use the 'search_menu' tool.

Tone: Concise, professional, no emojis.
`

const TOOLS = [
    {
        type: "function",
        function: {
            name: "search_menu",
            description: "Search the restaurant menu for items or ingredients.",
            parameters: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "The food item or category to search for, e.g., 'burger', 'vegan', 'calories'"
                    }
                },
                required: ["query"]
            }
        }
    }
]

export class AiService {
    private apiKey: string;

    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY || "";
    }

    async processHostMessage(message: string, context: any): Promise<ChatResponse> {
        if (!this.apiKey) return { role: 'assistant', content: "System Error: AI Disconnected." };

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        { role: 'user', content: message }
                    ],
                    tools: TOOLS as any,
                    tool_choice: "auto"
                })
            });

            const data = await response.json();
            const choice = data.choices?.[0];

            if (!choice) return { role: 'assistant', content: "Error processing request." };

            // Handle Tool Calls (Menu Lookup)
            if (choice.finish_reason === "tool_calls") {
                const toolCall = choice.message.tool_calls[0];
                if (toolCall.function.name === "search_menu") {
                    const args = JSON.parse(toolCall.function.arguments);
                    const results = searchMenu(args.query);

                    // Feed result back to AI
                    const secondResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.apiKey}`
                        },
                        body: JSON.stringify({
                            model: 'gpt-4o',
                            messages: [
                                { role: 'system', content: SYSTEM_PROMPT },
                                { role: 'user', content: message },
                                { role: 'assistant', tool_calls: [toolCall] },
                                { role: 'tool', tool_call_id: toolCall.id, content: JSON.stringify(results) }
                            ]
                        })
                    });
                    const secondData = await secondResponse.json();
                    return { role: 'assistant', content: secondData.choices[0].message.content };
                }
            }

            return { role: 'assistant', content: choice.message.content };

        } catch (e) {
            console.error("AI Service Error:", e);
            return { role: 'assistant', content: "An internal error occurred." };
        }
    }
}

export const aiService = new AiService();
