"use server"

import { role } from "@/lib/utils";
import OpenAI from "openai";

const openai = new OpenAI();

export type NewChat = {
    prompt: string;
    memory: {
        "role": "system" | "user";
        "content": string
    }[]
}


export async function Think(data: NewChat) {

    if (!data.prompt) return;
    
    const completion = await openai.chat.completions.create({
        messages: [
            { "role": "system", "content": role},
            ...data.memory,
            { "role": "user", "content": data.prompt }
        ],
        model: "gpt-4-0125-preview",
        temperature: 0.9,
    });

    return completion.choices[0].message.content || undefined;
}
