import { role } from "@/lib/utils";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@clerk/nextjs";
import { AnthropicStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

// Create an Anthropic API client (that's edge friendly)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});



// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {

  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { memory, prompt } = await req.json();

  if (!prompt) {
    return new NextResponse("No prompt provided", { status: 400 });
  }

  // Ask Claude for a streaming chat completion given the prompt
  const response = await anthropic.messages.create({
    messages: [
      { role: "user", content: role },
      { role: "assistant", content: "Noted" },
      ...memory,
      { role: "user", content: prompt },
    ],
    model: "claude-3-opus-20240229",
    stream: true,
    max_tokens: 1000,
  });

  // Convert the response into a friendly text-stream
  const stream = AnthropicStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
