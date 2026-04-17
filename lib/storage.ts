import { Deck } from "./types"

export function saveDecks(decks: Deck[]): void {
    localStorage.setItem("decks", JSON.stringify(decks))
}

export function loadDecks(): Deck[] {
    const data = localStorage.getItem("decks")
    return data ? JSON.parse(data) : []
}

export function saveDeck(deck: Deck): void {
    const decks = loadDecks()
    const existing = decks.findIndex(d => d.id === deck.id)
    if (existing >= 0) {
        decks[existing] = deck
    } else {
        decks.push(deck)
    }
    saveDecks(decks)
}

export function deleteDeck(id: string): void {
    const decks = loadDecks().filter(d => d.id !== id)
    saveDecks(decks)
}