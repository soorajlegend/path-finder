"use client"

import { SaveNewMessage } from '@/actions/chat'
import { Think } from '@/actions/transformer'
import { ChatType } from '@/app/(routes)/main/page'
import Chats from '@/components/chats'
import { AnimatedTooltip } from '@/components/ui/animated-tooltip'
import { Button } from '@/components/ui/button'
import { IconMicrophone } from '@tabler/icons-react'
import { Paperclip, SendHorizonal } from 'lucide-react'
import React, { FormEventHandler, useEffect, useState, useTransition } from 'react'


interface ChatBodyProps {
    userId: string;
    chats: ChatType[];
}

const ChatBody = ({ userId, chats }: ChatBodyProps) => {

    const [isPending, startTransition] = useTransition();
    const [lastMessage, setLastMessage] = useState<ChatType | null>(null);
    const [prompt, setPrompt] = useState("");
    const [isNewResponse, setIsNewResponse] = useState(false);

    const [allChats, setAllChats] = useState<ChatType[]>(chats);

    useEffect(() => {
        if (!lastMessage) {
            return
        }
        setAllChats((state) => ([...state, lastMessage]))

        // save them to db

        const saveMessage = async () => {

            if (!lastMessage?.message) return;

            if (lastMessage.sender === "MASAAR") {
                await SaveNewMessage({
                    message: lastMessage.message,
                    sender: "MASAAR",
                    userId: userId
                })
            } else {
                await SaveNewMessage({
                    message: lastMessage.message,
                    sender: "YOU",
                    userId: userId
                })
            }

        }

        saveMessage();

    }, [lastMessage])


    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!prompt) return;

        setLastMessage({
            sender: "YOU",
            message: prompt,
            createdAt: new Date()
        });

        setPrompt("");
        setIsNewResponse(false);

        startTransition(() => {
            Think({
                memory: chats.map((chat) => ({
                    role: chat.sender === "MASAAR" ? "system" : "user",
                    content: chat.message,
                })),
                prompt
            }).then((data: string | undefined) => {
                setLastMessage({
                    sender: "MASAAR",
                    message: data || "I don't get your message, can you elaborate please?",
                    createdAt: new Date()
                });
                setIsNewResponse(true);
            })
        });
    };


    return (
        <div className="flex flex-col h-full w-full ">
            <div className="flex-1 w-full h-full pb-[90px] ">
                <Chats
                    chats={allChats}
                    isThinking={isPending}
                    isNewResponse={isNewResponse}
                />
            </div>
            {/* input */}
            <div className="h-[80px] w-full fixed bottom-0 bg-white py-2 px-3 lg:px-0">
                <form onSubmit={onSubmit}>
                    <div className="w-full max-w-4xl mx-auto flex items-center  ring-1 ring-slate-300 px-5 py-2 rounded-[10px]">
                        <Paperclip className='w-5 h-5  text-slate-500' />
                        <input
                            value={prompt}
                            placeholder='send a message'
                            onChange={(e) => setPrompt(e.target.value)}
                            className='w-full border-1 border-blue-100 p-2 ml-2  outline-none focus-visible:ring-0 focus-visible:border-none '
                        />
                        {
                            !!prompt ? (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={isPending || !!!prompt}
                                    className='rounded-[10px]'
                                >
                                    <SendHorizonal className='w-5 h-5  text-slate-500 hover:bg-blue-600 transition hover:text-white' />
                                </Button>
                            ) : (
                                <div className="relative">
                                    <AnimatedTooltip
                                        label='coming soon!'
                                    >
                                        <IconMicrophone className='w-5 h-5  text-slate-500' />
                                    </AnimatedTooltip>
                                </div>
                            )
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChatBody