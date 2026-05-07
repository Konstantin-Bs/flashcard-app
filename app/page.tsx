"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function Home() {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && user) {
            router.push("/home")
            router
        }
    }, [user, loading])

    function handleSignUp() {
        router.push("/register")
    }

    return (
        <div className="flex flex-col items-center justify-center mt-32 max-w-full gap-12">
            <h1 className="text-8xl text-center font-sans">
                Welcome to
                <span className="block">FlashAI</span>
            </h1>
            <button 
                onClick={handleSignUp}
                className="text-4xl text-white font-sans rounded-2xl p-3.5 bg-blue-600/85 hover:bg-blue-600 cursor-pointer"
            >
                Sign Up
            </button>
        </div>
    )
}