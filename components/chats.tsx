"use effect"

import React, { useEffect, useRef, useState } from 'react'
import ChatItem from './chat-item';
import { ChatType } from '@/app/(routes)/main/page';

interface ChatProps {
    chats: ChatType[];
    isThinking: boolean;
}

const Chats = ({ chats, isThinking }: ChatProps) => {


    const bottomContainerRef = useRef<HTMLDivElement>(null)
    const [isMounted, setIsMounted] = useState(false)

    const scrollToBottom = () => {
        if (bottomContainerRef.current) {
            bottomContainerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        scrollToBottom();
    }, [isThinking, chats]);

    useEffect(() => {
        scrollToBottom();
    }, [isMounted]);

    if (!isMounted) return null;

    return (
        <div className='w-full h-full overflow-y-scroll '>
            <div className="w-full h-auto flex flex-col max-w-4xl mx-auto mt-[60px] px-2 lg:px-0">
                {
                    chats?.map((chatMessage, idx) => {
                        return (
                            <ChatItem
                                key={idx}
                                data={chatMessage}
                            />
                        )
                    })
                }
                {isThinking && <div className="w-7 h-7 bg-black/50 rounded-full animate-pulse" />}
                <div
                    ref={bottomContainerRef}
                    className="py-5"
                />
            </div>
        </div>
    )
}

export default Chats