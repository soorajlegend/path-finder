import { SparklesPreview } from "@/components/sparkles-preview"
import Image from "next/image"

export default function AuthLayput({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-full flex justify-center items-center">
            <div className="w-full h-full hidden lg:flex items-center justify-center relative bg-slate-200">
                <Image
                    src="/image1.jpeg"
                    fill
                    alt="AI-world"
                    className="absolute inset-0 brightness-50"
                />
                <SparklesPreview />
               
            </div>
            <div className="w-full h-full flex items-center justify-center lg:w-2/3">
                {children}
            </div>
        </div>
    )
}