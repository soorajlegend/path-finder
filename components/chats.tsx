"use effect"

import React, { useEffect, useRef, useState } from 'react'
import ChatItem from './chat-item';
import { ChatType } from '@/app/(routes)/main/page';
import { currentUser, useUser } from '@clerk/nextjs';
import { ArrowDown } from 'lucide-react';
import { Button } from './ui/button';
import { AnimatedTooltip } from './ui/animated-tooltip';
import { cn } from '@/lib/utils';

interface ChatProps {
    chats: ChatType[];
    isThinking: boolean;
}

const Chats = ({ chats, isThinking }: ChatProps) => {


    const { user } = useUser();
    const containerRef = useRef<HTMLDivElement>(null);
    const bottomContainerRef = useRef<HTMLDivElement>(null)
    const [isMounted, setIsMounted] = useState(false)
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

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



    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                setIsScrolledToBottom(
                    containerRef.current.scrollTop + containerRef.current.offsetHeight >=
                    containerRef.current.scrollHeight
                );
            }
        };


        containerRef?.current?.addEventListener('scroll', handleScroll);

        return () => {
            containerRef?.current?.removeEventListener('scroll', handleScroll);
        };
    }, [containerRef, isMounted]);

    if (!isMounted) return null;

    return (
        <div
            ref={containerRef}
            className='w-full h-full overflow-y-auto overflow-x-hidden'
        >
            <div className=" w-full h-auto flex flex-col max-w-4xl mx-auto mt-[60px] px-2 lg:px-0">
                {
                    chats?.map((chatMessage, idx) => {
                        return (
                            <ChatItem
                                key={idx}
                                data={chatMessage}
                                avatar={user?.imageUrl || ''}
                                isLast={idx === chats.length - 1}
                            />
                        )
                    })
                }
                <div
                    ref={bottomContainerRef}
                    className="py-5"
                />
            </div>
            <div className={cn(
                "fixed w-full bottom-[90px] flex justify-center p-3 pointer-events-none transition duration-300 delay-100",
                isScrolledToBottom ? "opacity-0 translate-y-full  z-0" : "opacity-100  z-50 translate-y-0"
            )}>
                <AnimatedTooltip
                    label='Back to bottom'
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={scrollToBottom}
                        className='p-2 bg-white rounded-full shadow-xl animate-bounce relative z-50 pointer-events-auto transition'
                    >
                        <ArrowDown className='w-12 h-12' />
                    </Button>
                </AnimatedTooltip>
            </div>
        </div>
    )
}

export default Chats