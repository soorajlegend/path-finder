"use server"

import { role } from "@/lib/utils";
import OpenAI from "openai";

import fs from "fs";
import path from "path";

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



const speechFile = path.resolve("./speech.mp3");

export async function TTS() {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: `
    *Narrator/Facilitator (Voiceover):* "Have you ever felt uncertaint about your life direction?, Well over 70% of people report feeling uncertain about their life's direction as well? What if you could have a guide, a mentor, who knows you better than you know yourself?"

*Facilitator:* "During our extensive market research, we encountered Nate, a , 'I know I'm meant for something greater, but I just don't know what it is or how to get there.'"


*Facilitator (Voiceover):* "Aisha's story is not unique. It reflects a widespread dilemma in our society—the quest for purpose and clarity in an ever-changing world."


*Facilitator:* "This is the problem we're facing—a world full of paths where it's easy to feel lost. But what if there was a solution?"


*Facilitator (Enthusiastically):* "Introducing Masaar, your personal pathfinder. Using the power of AI, Masaar transforms the complexity of life into a journey of self-discovery and fulfillment."


*Facilitator:* "Masaar is not just any AI. It's a companion that understands your deepest aspirations and challenges. Through a unique blend of empathetic generative AI, Masaar offers personalized guidance that evolves with you."


*Facilitator (Voiceover):* "Starting with Masaar is as simple as having a conversation. Share your story, your dreams, and your obstacles. Masaar listens, learns, and lights the way forward with insights and advice tailored just for you."

*Narrator/Facilitator (Voiceover):* "But Masaar isn't just a groundbreaking platform for personal guidance—it's a revolutionary business poised for unprecedented growth."

[Cut to: Dynamic charts and graphs illustrating market size, potential reach, and user engagement.]

*Facilitator:* "Consider this: With over 3 billion internet users worldwide searching for meaning, direction, and personal growth, the market for Masaar is vast and untapped. Our initial focus is on the millennial and Gen Z demographics, who not only embrace technology but also prioritize personal development and mental wellness."

[Visual: A pie chart showing market segmentation, with a significant slice allocated to Masaar's target audience.]

*Facilitator (Voiceover):* "Masaar taps into this burgeoning demand with a dual revenue model. First, a subscription-based tier offering personalized guidance and exclusive content. Second, a premium tier providing one-on-one sessions with top-tier coaches, augmented by Masaar's AI insights."

*Facilitator:* "But our vision extends beyond direct revenue. Partnership opportunities with educational institutions, career development platforms, and wellness organizations will open additional revenue streams and increase user engagement."

*Facilitator:* "In just six months of operation, Masaar has already seen a 50% growth in user base, with a 40% conversion rate from free to premium subscriptions. And this is just the beginning."

*Facilitator (Enthusiastically):* "With a scalable platform, a clear monetization strategy, and a passionate team, Masaar is set to redefine not just personal development, but the way we envision AI's role in our lives."

*Facilitator:* "Masaar isn't just a product; it's a movement towards a more self-aware and fulfilled global community. We're inviting investors who share our vision to join us on this journey. Together, we'll not only create a successful business but make a profound impact on lives around the world."

[End: Call to Action - "Discover the future with Masaar. Invest in a brighter tomorrow."]


*Facilitator:* "Join us at Masaar. Together, we'll discover not just where you're going, but who you're meant to be. Your path is waiting."
    `,
  });
  
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);

  return speechFile;
}