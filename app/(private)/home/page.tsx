"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home() {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
      router.push("/")
      router
        }
    }, [user, loading])

    function handleDecks() {
        router.push("/decks")
    }

    return(
        <div>
        <div className="flex items-center justify-center mt-55">
            <button
                onClick={handleDecks}
                className="text-8xl border-2 border-black dark:border-white/30 hover:border-transparent dark:hover:border-transparent font-Bold rounded-2xl hover:bg-gray-200 shadow-2xl dark:hover:bg-slate-800 p-7"
            >
                My Decks
            </button>
        </div>
        </div>
    )
}