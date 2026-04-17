"use client"

import { useState } from "react"
import { Flashcard } from "@/lib/types"

interface Props {
    onCardsGenerated: (cards: Flashcard[], deckName: string) => void
}

export default function GenerateForm({ onCardsGenerated }: Props) {
    const [notes, setNotes] = useState("")
    const [deckName, setDeckName] = useState("")
    const [count, setCount] = useState(3)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleGenerate() {
        if (!notes.trim() || !deckName.trim()) {
            setError("Please enter a deck name and your notes")
            return
        }

        setLoading(true)
        setError("")

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notes, count }),
            })

            const data = await response.json()

            if (data.error) {
                setError(data.error)
                return
            }

            onCardsGenerated(data.flashcards, deckName)
        }   catch (e) {
            setError("Something went wrong, please try again")
        }   finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-4 max-w-2x1 mx-auto p-6">
            <h1 className="text-2x1 font-bold">Generate Flashcards</h1>

            <input
                type="text"
                placeholder="Deck name"
                value={deckName}
                onChange={e => setDeckName(e.target.value)}
                className="border rounded p-2 w-full"
            />

            <textarea
                placeholder="Paste your notes here..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={8}
                className="border rounded p-2 w-full resize-none"
            />

            <select
                value={count}
                onChange={e => setCount(Number(e.target.value))}
                className="border rounded p-2 w-full"
            >
                <option value={3}>3 Cards</option>
                <option value={10}>10 Cards</option>
                <option value={20}>20 Cards</option>
                <option value={30}>30 Cards</option>
            </select>

            {error && <p className="text-red-500">{error}</p>}

            <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-blue-500 text-white rounded p-2 font-semibold disabled:opacity-50"
            >
                {loading ? "Generating..." : "Generate Flashcards"}
            </button>
        </div>
    )
}