import { openai } from "@ai-sdk/openai";
import { Agent } from "@convex-dev/agent";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { action } from "./_generated/server";
import { z } from "zod";

const createThreadSchema = z.object({
  prompt: z.string(),
  code: z.string().min(50),
});

const supportAgent = new Agent(components.agent, {
  chat: openai.chat("gpt-4o-mini"),
  textEmbedding: openai.embedding("text-embedding-3-small"),
  instructions:
    "You are a code review assistant that is a Senior Software Engineer. Your goal is to help developers review their code by providing constructive feedback, identifying potential issues, and suggesting improvements. Focus on code quality, best practices, and potential bugs but avoid being too basic.",
  tools: {},
});

export const supportAgentStep = supportAgent.asAction({ maxSteps: 10 });

export const createCodeReviewThread = action({
  args: {
    prompt: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    //validate with zod
    const { prompt, code } = createThreadSchema.parse(args);

    const { threadId, thread } = await supportAgent.createThread(ctx);

    const result = await thread.generateText({
      prompt: `${prompt}\n\nHere's the code to review:\n\`\`\`\n${code}\n\`\`\``,
    });

    console.log(result.text);

    return { threadId, text: result.text };
  },
});
