"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signUp, signInWithGoogle } from "@/lib/auth"

export default function RegisterPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    async function handleRegister() {
        if (!email || !password) {
            setError("Please fill in all fields")
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters")
            return
        }

        setLoading(true)
        setError("")

        const { error } = await signUp(email, password)

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }
        setSuccess(true)
    }

    return (
        <div className="max-w-sm mx-auto top-20 p-6">
            <div>
                <h1 className="text-2xl p-6 font-semibold mb-6 text-center">
                    Sign up to FlashAI
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
                        placeholder="Password (min. 8 characters)"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="border border-black dark:border-white/30 rounded p-2.5 w-full"
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        onClick={handleRegister}
                        disabled={loading}
                        className="rounded-md p-2.5 font-semibold disabled:opacity-50 text-white bg-blue-800/85 hover:bg-blue-800 cursor-pointer"
                    >
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="flex-1 border-t border-black dark:border-white/30"/>
                        <span className="text-sm text-gray-400">or</span>
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
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
                {success && (
                    <div className="text-center">
                    <p className="text-green-600 text-sm">
                    Check your email to confirm your account.
                    </p>
                    </div>
                )}
            </div>
        </div>
    )
}