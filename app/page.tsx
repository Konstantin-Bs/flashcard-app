"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import GenerateForm from "@/components/GenerateForm"
import { loadDecks, saveDeck, deleteDeck } from "@/lib/storage"
import { Deck, Flashcard } from "@/lib/types"

export default function Home() {
  const router = useRouter()
  const [decks, setDecks] = useState<Deck[]>([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    setDecks(loadDecks())
  }, [])

  function handleCardsGenerated(cards: Flashcard[], deckName: string) {
    const newDeck: Deck = {
      id: Date.now().toString(),
      name: deckName,
      cards,
      createdAt: Date.now(),
    }
    saveDeck(newDeck)
    setDecks(loadDecks())
    setShowForm(false)
  }

  function handleDelete(id: string) {
    deleteDeck(id)
    setDecks(loadDecks())
  }

  function handleStudy(id: string) {
    localStorage.setItem("studyingDeckId", id)
    router.push("/study")
  }

  if (showForm) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <button
          onClick={() => setShowForm(false)}
          className="text-sm text-gray-400 hover:text-gray-600 ml-6 mb-4"
        >
          ← Back
        </button>
        <GenerateForm onCardsGenerated={handleCardsGenerated} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Decks</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white rounded-xl p-3 px-6 font-semibold hover:bg-blue-600 transition-colors"
        >
          + New Deck
        </button>
      </div>

      {decks.length === 0 && (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-lg">No decks yet</p>
          <p className="text-sm mt-2">Create your first deck to get started</p>
        </div>
      )}

       <div className="flex flex-col gap-4">
        {decks.map(deck => (
          <div
            key={deck.id}
            className="border-2 rounded-xl p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div>
              <h2 className="font-semibold text-lg">{deck.name}</h2>
              <p className="text-sm text-gray-400">{deck.cards.length} cards</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deck.id)}
                className="text-sm text-red-400 hover:text-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => handleStudy(deck.id)}
                className="bg-blue-500 text-white rounded-lg p-2 px-4 text-sm font-semibold hover:bg-blue-600 transition-colors"
              >
                Study
              </button>
            </div>
          </div>
        ))}
        </div>
      </div>  
  )
}