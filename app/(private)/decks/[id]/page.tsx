"use client"

import { useState, useEffect, use } from "react"
import { Flashcard, Deck } from "@/lib/types"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import GenerateForm from "@/components/GenerateForm"
import { Pencil, Check, Trash2, ArrowLeft } from "lucide-react"

export default function DeckDetailPage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = use(params)
  const {user, loading} = useAuth()
  const router = useRouter()
  const [cards, setCards] = useState<Flashcard[]>([])
  const [deckName, setDeckName] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState("")

  async function fetchDeck() {
      const { data, error } = await supabase
        .from("decks")
        .select(`id, name, cards(id, question, answer)`)
        .eq("id", id)

      if (error || !data) {
        router.push("/decks")
        return
      }

      setCards(data[0].cards)
      setDeckName(data[0].name)
      setEditedName(data[0].name)
    }

  useEffect(() => {

    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (!loading && user) {
      fetchDeck()
    }

  }, [user, loading])

  async function handleDeleteCard(cardId: string | undefined) {
    if (!cardId) return
    const { error } = await supabase
      .from("cards")
      .delete()
      .eq("id", cardId) 
    if (error) {
      alert("Something went wrong. Please try again.")
      return
    }
    setCards(prev => prev.filter(card => card.id !== cardId))
  }

  function handleIsEditingName() {
    setIsEditingName(true)
  }

  async function handleEditName() {
    if (editedName !== "") {
      const { error } = await supabase
        .from("decks")
        .update({ name: editedName })
        .eq("id", id)
      if (error) {
        alert("Something went wrong. Please try again.")
        return
      }
      setDeckName(editedName)
      setIsEditingName(false)
    } else {
      alert("Name can't be empty.")
    }
  }

  async function handleSuccess() {
    fetchDeck()
    setShowForm(false)
  }

  if (showForm) {
      return (
        <div>
          <GenerateForm deckId={id} onSuccess={handleSuccess} onClose={() => setShowForm(false)}/>
        </div>
      )
    }

  return (
  <div className="max-w-6xl mx-auto p-6">
    <div className="flex items-center justify-between pb-3">
      <button 
        className="hover:text-gray-400 cursor-pointer"
        onClick={() => router.push("/decks")}
      >
        <ArrowLeft/>
      </button>
      {!isEditingName && (
        <div className="flex items-center gap-3.5 pl-2">
          <h1 className="text-xl pl-0.5 cursor-default">{deckName}</h1>
          <button onClick={handleIsEditingName} className="rounded-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-slate-900 p-1 cursor-pointer">
            <Pencil size={15}/>
          </button>
        </div>
      )}
      {isEditingName && (
        <div className="flex items-center gap-3.5 pl-2">
          <input
            value={editedName}
            onChange={e => setEditedName(e.target.value)}
            className="text-xl border rounded-md pl-0.5"
            size={15}
          />
          <button onClick={handleEditName} className="rounded-sm bg-green-600 hover:bg-green-700 p-1 cursor-pointer">
            <Check size={15}/>
          </button>
        </div>
      )}
      <p>{cards.length} cards</p>
    </div>
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="border border-black dark:border-white/30 p-2">#</th>
          <th className="border border-black dark:border-white/30 p-2 text-left">Question</th>
          <th className="border border-black dark:border-white/30 p-2 text-left">Answer</th>
          <th className="border border-black dark:border-white/30 p-2 text-left"></th>
        </tr>
      </thead>
      <tbody>
        {cards.length === 0 ? (
          <tr>
            <td colSpan={4} className="text-center py-8">
              No cards yet
            </td>
          </tr>
        ) : (
        cards.map((card, index) => (
          <tr key={card.id} className="bg-gray-100 dark:bg-slate-900">
            <td className="border border-black dark:border-white/10 p-2 text-center">{index + 1}</td>
            <td className="border border-black dark:border-white/10 p-2">{card.question}</td>
            <td className="border border-black dark:border-white/10 p-2">{card.answer}</td>
            <td className="border border-black dark:border-white/10 p-2">
              <button
                onClick={() => handleDeleteCard(card.id)}
                className="w-full border border-transparent rounded p-2 cursor-pointer text-red-500 hover:text-red-700"
              >
                <Trash2/>
              </button>
            </td>
          </tr>
        )))}
      </tbody>
    </table>
    <div className="flex justify-center mt-4">
      <button 
        onClick={() => setShowForm(true)}
        className="rounded-md py-3 px-10 text-2xl font-semibold text-white bg-blue-800/85 hover:bg-blue-800 cursor-pointer"
      >
        Add Cards
      </button>
    </div>
  </div>
)
}