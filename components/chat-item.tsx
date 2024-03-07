"use client"

import React from 'react'
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TypewriterEffect } from './ui/typewriter-effect';
import Typing from './ui/typing';

interface ChatMessage {
    data: {
        sender: "YOU" | "MASAAR";
        message: string;
        createdAt: Date;
    }
    typeWriter: boolean;
}

const ChatItem = ({ data, typeWriter }: ChatMessage) => {
    return (
        <motion.div
            initial={{ rotateX: 70, translateX: 5, scale: 0.7, skewX: 10, }}
            whileInView={{ rotateX: 0, translateX: 0, scale: 1, skewX: 0, }}
            transition={{
                bounce: 1,
                duration: 0.5,
                ease: "easeInOut"

            }}
            style={{ perspective: 500 }}
            className="py-2 w-full max-w-4xl mx-auto px-3 lg:px-0 ">
            <Card className={cn("relative w-full flex flex-col gap-y-1 p-3 pl-3 lg:pl-5  rounded-[10px] border-none shadow-none",
                data.sender === "MASAAR" ? "bg-slate-100" : "bg-slate-50")}>
                <p className="whitespace-pre-line text-sm text-black">
                    {typeWriter ? (
                        <Typing
                        words={[data.message,]}
                        />
                    ) : data.message}
                </p>
                <span className="text-gray-500 text-xs">{format(data.createdAt, "hh:mm:aa")}</span>
                <Avatar className={cn(
                    'w-6 h-6 absolute  bottom-0  translate-y-1/4 border-2 border-white ring-2 ring-white',
                    data.sender === "MASAAR" ? "left-0 -translate-x-1/3" : "right-0 translate-x-1/3"
                )}>
                    <AvatarImage src={`/${data.sender === "MASAAR" ? "image1.jpeg" : "image2.jpeg"}`} />
                    <AvatarFallback />
                </Avatar>
            </Card>
        </motion.div>
    )
}

export default ChatItem