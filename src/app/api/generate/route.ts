import { NextResponse } from 'next/server';
import OpenAI from 'openai';


export async function POST(req: Request) {
  try {
    const { repoContext, tone = 'professional' } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        // Helper to enqueue SSE data
        const sendEvent = (type: string, content: string) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type, content })}\n\n`));
        };

        const contextString = JSON.stringify(repoContext, null, 2);

        // Define the 3 Prompts
        const landingPrompt = `You are a world-class SaaS copywriter. Given this codebase analysis, generate a landing page with:
- Hero: One powerful headline (6-10 words) + subheadline (1 sentence)  
- 3 Feature Blocks: Icon suggestion + title + 2-sentence description
- CTA: Action-oriented button text + supporting microcopy
- Social Proof: Suggest 3 "built with" badges based on the tech stack

Context: ${contextString}
Tone: ${tone}`;

        const phPrompt = `You are a successful indie hacker writing a Product Hunt maker comment.
Follow this proven format:
1. Friendly intro ("Hey PH! 👋")
2. Problem statement (2 sentences, relatable pain)
3. Solution (what the product does, 2 sentences)
4. The "secret sauce" (1 technical differentiator)
5. Ask for feedback (specific question, not generic)

Context: ${contextString}`;

        const twitterPrompt = `You are a developer with 50k followers writing a viral build thread.
Generate a 5-tweet thread using "🧵" or numbers to separate tweets. Keep it punchy:
1. Hook: "I just built [X]. Here's exactly how. 🧵"
2. The problem (relatable, specific)
3. Tech stack breakdown (short, punchy, with emojis)
4. The "aha moment" (one specific architectural decision from commits)
5. CTA: Try it yourself + what's next

Context: ${contextString}
Recent commits: ${JSON.stringify(repoContext.recentWork || [])}`;

        // Runner function
        const runStream = async (type: string, prompt: string) => {
          try {
            const completion = await openai.chat.completions.create({
              model: 'gpt-4o',
              messages: [{ role: 'system', content: prompt }],
              stream: true,
            });

            for await (const chunk of completion) {
              const text = chunk.choices[0]?.delta?.content || "";
              if (text) {
                sendEvent(type, text);
              }
            }
          } catch (e: unknown) {
             sendEvent(type, `\n\n**Error**: ${(e as Error).message}`);
          }
        };

        // Fire all 3 in parallel
        await Promise.all([
          runStream('landing', landingPrompt),
          runStream('producthunt', phPrompt),
          runStream('twitter', twitterPrompt),
        ]);

        // Finish the stream
        controller.enqueue(encoder.encode(`data: {"type": "done"}\n\n`));
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initialize generation stream' },
      { status: 500 }
    );
  }
}
