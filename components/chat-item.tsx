"use client"

import React, { useState } from 'react'
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
    avatar: string;
    isLast: boolean;
}


const ResponseSkeleton = () => {
    return (
        <div className="flex flex-row justify-start items-start gap-x-3 relative p-3 my-3">
            <Skeleton className='ring-2 ring-white w-9 h-9 rounded-full' />
            <div className="w-full flex flex-col gap-y-2 rounded-[10px] shadow-sm">
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-4 w-2/4' />
                <div className="h-2 w-full" />
                <Skeleton className='h-4 w-4/5' />
                <Skeleton className='h-4 w-5/6' />
                <Skeleton className='h-4 w-3/4' />
            </div>
        </div>
    )
}


const ChatItem = ({ data, avatar, isLast }: ChatMessage) => {

    const [displayAll, setDisplayAll] = useState(true);

    if (!data?.message.length) {
        return <ResponseSkeleton />
    }

    const isMasaar = data.sender === "MASAAR"

    return (
        <div
            className={cn(
                " top-0 w-full h-full flex bg-white overflows-y-scroll hidden-scrollbar rounded-[10px] cursor-pointer",
                displayAll || isLast ? "relative" : "relative"

            )}
            // onClick={() => setDisplayAll(!displayAll)}
        >
            <motion.div
                initial={{ rotateX: 45, scale: 0.9, }}
                whileInView={{ rotateX: 0, scale: 1, }}
                transition={{
                    bounce: 1,
                    duration: 0.5,
                    ease: "easeInOut"

                }}
                style={{ perspective: 500 }}
                className="py-2 w-full max-w-4xl mx-auto px-3 lg:px-0 sticky top-0  ">
                <div className="flex w-full gap-3 relative">
                    <Avatar className='w-8 h-8 border-1 border-white ring-1 ring-white '>
                        <AvatarImage src={`${isMasaar ? "/logo.png" : avatar}`} />
                        <AvatarFallback />
                    </Avatar>
                    <Card className={cn("relative overflow-hidden w-full flex flex-col gap-y-1 p-3 pl-3 lg:pl-5  rounded-[8px] border-none shadow-none border-white border-2",
                        !isMasaar && "bg-slate-50")}>
                        <div className={cn(
                            "w-full  text-base text-black overflow-x-auto styled-scrollbar whitespace-pre-wrap transition",
                            !displayAll && !isLast && "line-clamp-[10]"
                        )}>
                            <Markdown>
                                {data.message}
                            </Markdown>
                        </div>
                        <span className={cn(
                            "text-gray-500 text-xs",
                            isMasaar && "text-right"
                        )}>{format(data.createdAt, "hh:mm:aa")}</span>
                    </Card>

                </div>
            </motion.div>
        </div>
    )
}

export default ChatItem
