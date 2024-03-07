import { GeminiEffect } from "@/components/hero";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {

  const { userId } = auth()

  if (userId) {
    redirect("/main")
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="fixed z-50 top-0 w-full justify-between">
        <div className="flex justify-between items-center max-w-7xl mx-auto py-3 px-3 lg:px-0">
          <div className="uppercase tracking-[5px] font-semibold">Masaar</div>
          <Button variant="outline" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </div>
      </div>
      <GeminiEffect />
    </main>
  );
}
