import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { role } from "@/lib/utils";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

const openai = new OpenAI();

export type NewChat = {
  prompt: string;
  memory: {
    role: "system" | "user";
    content: string;
  }[];
};

export const runtime = "edge";

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request

  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { memory, prompt } = await req.json();

  if (!prompt) {
    return new NextResponse("No prompt provided", { status: 400 });
  }

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: role },
      ...memory,
      { role: "user", content: prompt },
    ],
    model: process.env.OPENAI_API_MODEL || "gpt-3.5-turbo",
    temperature: 0.9,
    stream: true,
  });

  // const stream = OpenAIStream(completion, {
  //   async onCompletion(completion) {
  //     await db.chat.create({
  //       data: {
  //         message: completion,
  //         sender: "MASAAR",
  //         userId: userId,
  //       },
  //     });
  //   },
  // });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(completion);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
