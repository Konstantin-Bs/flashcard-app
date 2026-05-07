"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn, signInWithGoogle } from "@/lib/auth"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] =useState(false)

    async function handleLogin() {
        if (!email || !password) {
            setError("Please fill in all fields")
            return
        }

        setLoading(true)
        setError("")

        const { error } = await signIn(email, password)

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        router.push("/home")
    }

    return (
        <div className="max-w-sm mx-auto top-20 p-6">
            <div>
                <h1 className="text-2xl p-6 font-semibold mb-6 text-center">
                    Sign in to AppName
                </h1>
            </div>
            <div>
                <div className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="border border-black dark:border-white/30 rounded p-2.5 w-full"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="border border-black dark:border-white/30 rounded p-2.5 w-full"
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="rounded-md p-2.5 font-semibold disabled:opacity-50 text-white bg-blue-800/85 hover:bg-blue-800 cursor-pointer"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="flex-1 border-t border-black dark:border-white/30"/>
                        <span className="text-sm">or</span>
                        <div className="flex-1 border-t border-black dark:border-white/30"/>
                    </div>

                    <button
                        onClick={async () => await signInWithGoogle()}
                        className="rounded-md p-2.5 w-full font-semibold border border-black dark:border-white/25 bg-gray-200/85 dark:bg-gray-700/85 hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer"
                    >
                        Continue with Google
                    </button>
                </div>
                <div className="p-5">
                    <p className="text-sm text-center">
                        No account?{" "}
                        <Link href="/register" className="text-blue-600 hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}