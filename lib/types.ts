export interface Flashcard{
    question: string
    answer: string
}

export interface Deck{
    id: string
    name: string
    cards: Flashcard[]
    createdAt: number
}