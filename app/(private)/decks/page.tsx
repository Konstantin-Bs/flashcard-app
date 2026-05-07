"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import NameForm from "@/components/NameForm"
import { loadDecks, deleteDeck } from "@/lib/storage"
import { Deck, Flashcard } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function Home() {
  const { user, loading } = useAuth()

  const router = useRouter()
  const [decks, setDecks] = useState<Deck[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loadingDecks, setLoadingDecks] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      router
    }

    if (!loading && user) {
      setLoadingDecks(true)
      loadDecks(user.id).then(data => {
        setDecks(data)
        setLoadingDecks(false)
      })
    }
  }, [user, loading])

  async function handleDelete(id: string) {
    await deleteDeck(id)
    if (user) {
      const updated = await loadDecks(user.id)
      setDecks(updated)
    }
  }

  function handleStudy(id: string, cardsCount: number) {
    if (cardsCount === 0) {
      return
    }
    router.push(`/decks/${id}/study`)
  }

  function handleDecksList(id: string) {
    router.push(`/decks/${id}`)
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-semibold">My Decks:</h1>
        <div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-800 hover:text-white/85 text-white rounded-xl p-4 font-semibold hover:bg-blue-600/50 transition-colors flex items-center gap-1.5"
          >
            <Plus size={20} strokeWidth={2}/>
            Add Deck
          </button>
        </div>
      </div>

      {loadingDecks && (
        <p className="text-gray-400 text-center mt-20">Loading decks...</p>
      )}

      {!loadingDecks && decks.length === 0 && (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-lg">No decks yet</p>
          <p className="text-sm mt-2">Create your first deck to get started</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {decks.map(deck => (
          <div
            key={deck.id}
            className="rounded-xl p-5 flex items-center justify-between border border-black dark:border-white/30 dark:bg-slate-900 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
            onClick={() => handleDecksList(deck.id)}
          >
            <div>
              <h2 className="font-semibold text-lg">{deck.name}</h2>
              <p className="text-sm text-gray-400">{deck.cards.length} cards</p>
            </div>
            <div className="flex gap-4.5">
              <button
                onClick={(e) => {e.stopPropagation(); handleDelete(deck.id)}}
                className="text-sm text-red-400 hover:text-red-600"
              >
                Delete
              </button>
              <button
                onClick={(e) => {e.stopPropagation(); handleStudy(deck.id, deck.cards.length)}}
                className="bg-slate-500 dark:bg-slate-700 text-white rounded-lg p-2 px-4 text-sm font-semibold hover:bg-slate-600 dark:hover:bg-slate-800 border border-transparent hover:border-white/30 transition-colors"
              >
                Study
              </button>
            </div>
          </div>
        ))}
      </div>
      {showForm && <NameForm onClose={() => setShowForm(false)} />}
    </div>
  )
}