"use client"

import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import { useRouter } from "next/navigation"
import ProfilePanel from "./ProfilePanel"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { UserRound, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

export function Header() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [showProfile, setShowProfile] = useState(false)
    const { theme, setTheme } = useTheme()
    const pathname = usePathname()
    const hideHeader = ["/login", "/register"].includes(pathname)

    if (hideHeader) return null

    function handleSignIn() {
        router.push("/login")
    }

    function handleSignUp() {
        router.push("/register")
    }

    return (
        <div className="fixed inset-x-0 top-0 left-0 right-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-950 dark:border-white/30">
            <div>
                {user ? (
                    <div className="flex h-16 items-center justify-between px-6">
                        <div>
                            <Link href="/home">
                                Logo/Home
                            </Link>
                        </div>
                        <div className="flex items-center gap-5">
                            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="cursor-pointer">
                                {theme === "dark" ? <Sun size={25} strokeWidth={1}/> : <Moon size={25} strokeWidth={1}/>}
                            </button>
                            <button
                                onClick={() => setShowProfile(true)}
                                className="w-9 h-9 rounded-full border border-slate-950 dark:border-white bg-white text-slate-950 dark:bg-slate-950 dark:text-white hover:opacity-70 font-medium flex items-center justify-center cursor-pointer"
                            >
                                <UserRound size={34} absoluteStrokeWidth={true} strokeWidth={1}/>
                            </button>
                        </div>  
                    </div>
                ) : (
                    <div className="flex h-16 items-center justify-between px-6">
                        <div>
                            <Link href="/">
                                Logo/Home
                            </Link>
                        </div>
                        <div className="flex items-center gap-5">
                            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="cursor-pointer">
                                {theme === "dark" ? <Sun size={25} strokeWidth={1}/> : <Moon size={25} strokeWidth={1}/>}
                            </button>
                            <button
                                onClick={handleSignIn}
                                className="p-2 rounded-md border border-transparent hover:opacity-60 cursor-pointer"
                            >
                                SignIn
                            </button>
                            <button
                                onClick={handleSignUp}
                                className="p-2 rounded-md border border-slate-950 dark:border-white/30 hover:bg-gray-500 dark:hover:bg-slate-800 cursor-pointer"
                            >
                                SignUp
                            </button>
                        </div>
                    </div>
                )}
            </div>
        {showProfile && <ProfilePanel onClose={() => setShowProfile(false)} />}
        </div>
    )
}