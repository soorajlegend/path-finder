"use client"

import { SaveNewMessage } from '@/actions/chat'
import { ChatType } from '@/app/(routes)/main/page'
import Chats from '@/components/chats'
import { AnimatedTooltip } from '@/components/ui/animated-tooltip'
import { Button } from '@/components/ui/button'
import { IconMicrophone } from '@tabler/icons-react'
import { Paperclip, SendHorizonal } from 'lucide-react'
import React, { KeyboardEvent, useEffect, useState, useTransition } from 'react'

interface ChatBodyProps {
    userId: string;
    chats: ChatType[];
}

const ChatBody = ({ userId, chats }: ChatBodyProps) => {


    const [isPending, startTransition] = useTransition();
    const [prompt, setPrompt] = useState("");
    const [allChats, setAllChats] = useState<ChatType[]>(chats);
    const [stream, setStream] = useState("")
    const [isStreaming, setIsStreaming] = useState(false)

    const savePrompt = async (message: ChatType) => {

        if (!message?.message) return;
        setAllChats((state) => ([...state, message, {
            message: "",
            sender: "MASAAR",
            createdAt: new Date()
        }]))

        await SaveNewMessage({
            message: message.message,
            sender: "YOU",
            userId: userId
        })
    }


    const saveResponse = async (response: string) => {
        await SaveNewMessage({
            message: response,
            sender: "MASAAR",
            userId: userId
        })
    }

    useEffect(() => {
        if (stream === "") return;

        if (!isStreaming) {
            saveResponse(stream)
        }

        const updateLastObject = () => {
            const lastChat = allChats[allChats.length - 1];
            const updatedArray = [...allChats];
            updatedArray[allChats.length - 1] = {
                ...updatedArray[allChats.length - 1], ...{
                    ...lastChat,
                    message: stream
                }
            };
            setAllChats(updatedArray);
        };

        updateLastObject();

    }, [stream, isStreaming])


    const onSubmit = async (e: React.FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault();

        if (!prompt) return;

        // get the history before adding the prompt
        const history = [...allChats]

        savePrompt({
            sender: "YOU",
            message: prompt,
            createdAt: new Date()
        });

        setPrompt("");
        setStream("");

        setIsStreaming(true);
        const response = await fetch('/api/anthropic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Assuming JSON data
            },
            body: JSON.stringify({
                memory: [...history.map((chat) => ({
                    role: chat.sender === "MASAAR" ? "assistant" : "user",
                    content: chat.message,
                })),
                {
                    role: "user",
                    content: prompt
                }
                ],
            }),
        });

        // Check for successful response
        if (!response.body || !response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const reader = response.body.getReader();

        // Process data chunks in a loop
        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                setIsStreaming(false);
                console.log("finished")
                break;
            }
            setStream(state => state + new TextDecoder().decode(value))
        }

        reader.cancel();
    };


    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex-1 w-full h-full pb-[90px]  pt-[60px] md:pt-[70px] overflow-hidden">
                <Chats
                    chats={allChats}
                    isThinking={isPending}
                />
                {/* {stream} */}
            </div>
            {/* input */}
            <div className="h-[80px] w-full fixed bottom-0 bg-white py-2 px-3 lg:px-0">
                <form onSubmit={onSubmit}>
                    <div className="w-full max-w-4xl mx-auto flex items-center  ring-1 ring-slate-300 px-5 py-2 rounded-[10px]">
                        <Paperclip className='w-5 h-5  text-slate-500' />
                        <textarea
                            value={prompt}
                            placeholder='send a message'
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={1}
                            className='w-full border-1 border-blue-100 p-2 ml-2  outline-none focus-visible:ring-0 focus-visible:border-none resize-none hidden-scrollbar'
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    onSubmit(e);
                                }
                            }}
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