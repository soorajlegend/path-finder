"use client"

import React from 'react'
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Markdown from 'react-markdown';
import { Skeleton } from './ui/skeleton';
interface ChatMessage {
    data: {
        sender: "YOU" | "MASAAR";
        message: string;
        createdAt: Date;
    },
    avatar: string
}


const ResponseSkeleton = () => {
    return (
        <div className="flex flex-col relative gap-y-2 p-3 my-3 rounded-[10] shadow-sm">
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-4 w-2/4' />
            <div className="h-2 w-full" />
            <Skeleton className='h-4 w-4/5' />
            <Skeleton className='h-4 w-5/6' />
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 ring-2 ring-white w-7 h-7 rounded-full' />
        </div>
    )
}


const ChatItem = ({ data, avatar }: ChatMessage) => {

    if (!data?.message.length) {
        return <ResponseSkeleton />
    }

    console.log(avatar)

    const isMasaar = data.sender === "MASAAR"

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
                isMasaar ? "bg-slate-50" : "bg-slate-100")}>
                <div className=" text-sm text-black overflow-x-auto styled-scrollbar whitespace-pre-line">
                    <Markdown>
                        {data.message}
                    </Markdown>
                </div>
                <span className={cn(
                    "text-gray-500 text-xs",
                    isMasaar && "text-right"
                )}>{format(data.createdAt, "hh:mm:aa")}</span>
                <Avatar className={cn(
                    'w-6 h-6 absolute  bottom-0  translate-y-1/4 border-2 border-white ring-2 ring-white',
                    isMasaar ? "left-0 -translate-x-1/3" : "right-0 translate-x-1/3"
                )}>
                    <AvatarImage src={`${isMasaar ? "/logo.png" : avatar}`} />
                    <AvatarFallback />
                </Avatar>
            </Card>
        </motion.div>
    )
}

export default ChatItem
