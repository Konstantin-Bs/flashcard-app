"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import FlashCard from "@/components/FlashCard"
import { loadDecks } from "@/lib/storage"
import { Flashcard } from "@/lib/types"

export default function StudyPage() {
    const router = useRouter()
    const [cards, setCards] = useState<Flashcard[]>([])
    const [remaining, setRemaining] = useState<Flashcard[]>([])
    const [gotIt, setGotIt] = useState<Flashcard[]>([])
    const [deckName, setDeckName] = useState("")
    const [finished, setFinished] = useState(false)

    useEffect(() => {
        const deckId = localStorage.getItem("studyingDeckId")
        if (!deckId) {
            router.push("/")
            return
        }

        const decks = loadDecks()
        const deck = decks.find(d => d.id === deckId)

        if (!deck) {
            router.push("/")
            return
        }

        setDeckName(deck.name)
        setCards(deck.cards)
        setRemaining(deck.cards)
    }, [])

    function handleGotIt() {
        const current = remaining[0]
        const newRemaining = remaining.slice(1)
        setGotIt([...gotIt, current])

        if (newRemaining.length === 0) {
            setFinished(true)
        } else {
            setRemaining(newRemaining)
        }
    }

    function handleStillLearning() {
        const current = remaining[0]
        const newRemaining = [...remaining.slice(1), current]
        setRemaining(newRemaining)
    }

    function handleRestart() {
        setRemaining(cards)
        setGotIt([])
        setFinished(false)
    }

    if (finished) {
        return (
        <div className="flex flex-col items-center gap-6 p-6 max-w-2xl mx-auto mt-20">
            <h1 className="text-3xl font-bold">🎉 Done!</h1>
            <p className="text-gray-500">You got through all cards in {deckName}</p>
            <div className="flex gap-4">
                <button
                    onClick={handleRestart}
                    className="border-2 rounded-xl p-3 px-6 font-semibold hover:bg-gray-50"
                >
                    Study Again
                </button>
                <button
                    onClick={() => router.push("/")}
                    className="bg-blue-500 text-white rounded-xl p-3 px-6 font-semibold"
                >
                    Back Home
                </button>
            </div>
        </div>
        )
    }

    if (remaining.length === 0) return null

    return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="flex items-center justify-between px-6 mb-4">
        <h2 className="font-semibold text-gray-700">{deckName}</h2>
        <button
          onClick={() => router.push("/")}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          Exit
        </button>
      </div>

      <div className="flex gap-2 px-6 mb-6">
        <div className="text-sm text-gray-500">
          ✅ {gotIt.length} got it
        </div>
        <div className="text-sm text-gray-500 ml-4">
          📚 {remaining.length} remaining
        </div>
      </div>

      <FlashCard
        card={remaining[0]}
        index={cards.length - remaining.length}
        total={cards.length}
        onGotIt={handleGotIt}
        onStillLearning={handleStillLearning}
      />
    </div>
  )
}