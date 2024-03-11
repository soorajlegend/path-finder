import ChatBody from '@/components/chat-body';
import { getMessages } from '@/lib/chat-services';
import { UserButton, auth } from '@clerk/nextjs'
import Image from 'next/image';
import { redirect } from 'next/navigation';

export type ChatType = {
  sender: "YOU" | "MASAAR";
  message: string;
  createdAt: Date;
}

const MainPage = async () => {

  const { userId } = auth();


  if (!userId) {
    redirect("/")
  }

  const chats = await getMessages(userId);

  return (
    <div className='w-full h-full flex flex-col'>
      {/* header */}
      <div className="flex h-[60px] fixed top-0 z-50 bg-white py-2 w-full px-4 sm:px-6 lg:px-0">
        <div className="w-full max-w-5xl mx-auto flex justify-between items-center ">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          <UserButton />
        </div>
      </div>
      {/* body */}
      <div className="w-full h-full flex-1">
        <ChatBody
          userId={userId}
          chats={chats}
        />
      </div>
    </div>
  )
}

export default MainPage