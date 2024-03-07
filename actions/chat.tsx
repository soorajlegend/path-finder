"use server"

import { ChatType } from "@/app/(routes)/main/page"
import { ChatItem, newMessage } from "@/lib/chat-services"

export const SaveNewMessage = async (data: ChatItem) => {
    try {
        const newChat = await newMessage(data)
        return newChat
    } catch (e: any) {
        throw new Error(e)
    }
}