import { db } from "./db";

export interface ChatItem {
  userId: string;
  sender: "YOU" | "MASAAR";
  message: string;
}

export const newMessage = async (data: ChatItem) => {
  const chat = await db.chat.create({
    data: {
      userId: data.userId,
      sender: data.sender,
      message: data.message,
    },
  });

  return chat;
};

export const getMessages = async (userId: string) => {
  const chats = await db.chat.findMany({
    where: {
      userId,
    },
  });

  return chats;
};
