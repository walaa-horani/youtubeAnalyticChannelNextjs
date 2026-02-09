"use server";

import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { getChannelStats, getDetailedVideoStats } from "./youtube";

// Define the tools for the agent to use
const statsTool = tool(async () => {
    const data = await getChannelStats();
    return JSON.stringify(data);
}, {
    name: "get_channel_stats",
    description: "Get the current subscriber count, view count, and video count of the user's channel.",
    schema: z.object({}),
});

const videoStatsTool = tool(async () => {
    const data = await getDetailedVideoStats();
    return JSON.stringify(data);
}, {
    name: "get_video_stats",
    description: "Get detailed statistics for the user's recent videos (views, likes, comments).",
    schema: z.object({}),
});

const tools = [statsTool, videoStatsTool];

// Initialize the model
const model = new ChatOpenAI({
    model: "gpt-4o", // or "gpt-3.5-turbo"
    temperature: 0,
});

// System prompt to define the agent's persona and strategy
const systemPrompt = `You are a Senior YouTube Strategist and AI Channel Manager.
Your goal is to help the user grow their channel by interpreting their real data.

You have access to tools to fetch channel stats and video performance.
ALWAYS use these tools when asked about performance, specific videos, or improvements.

When analyzing:
1.  **Identify Top Performers**: Which videos have the most views or highest engagement?
2.  **Calculate Engagement**: (Likes + Comments) / Views. A good rate is > 5%.
3.  **Spot Trends**: Are specific topics performing better?
4.  **Give Actionable Advice**: Don't just list numbers. Say "Video X did well, so you should make a sequel."

Format your responses with clear Markdown (bold numbers, lists, bullet points).
`;

// Initialize the agent
const agent = createReactAgent({
    llm: model,
    tools,
    stateModifier: systemPrompt,
});

export async function generateLangGraphResponse(messages: any[]) {
    const langchainMessages = messages.map((m) => {
        if (m.role === "user") {
            return new HumanMessage(m.content);
        } else {
            return new AIMessage(m.content);
        }
    });

    const inputs = { messages: langchainMessages };

    const stream = await agent.stream(inputs, {
        streamMode: "values",
    });

    let finalResponse = "";
    for await (const chunk of stream) {
        // In "values" mode, chunk is the state. 'messages' is the list of messages.
        // We want the last message from the assistant.
        const lastMsg = chunk.messages[chunk.messages.length - 1];
        if (lastMsg._getType() === "ai") {
            finalResponse = lastMsg.content as string;
        }
    }

    return finalResponse;
}
