'use server';

import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateArticle(prompt) {
  const result = await streamText({
    model: openai('gpt-4o'),
    system: 'You are an expert academic research assistant.',
    prompt: prompt,
  });

  return result.toDataStreamResponse();
}
