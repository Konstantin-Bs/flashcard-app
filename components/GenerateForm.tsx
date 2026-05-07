"use client"

import { useState, useRef, useEffect } from "react"
import { Flashcard } from "@/lib/types"
import { addCardsToDeck } from "@/lib/storage"
import { X } from "lucide-react"

interface Props {
    deckId: string
    onSuccess: () => void
    onClose: () => void
}

export default function GenerateForm({ deckId, onSuccess, onClose }: Props) {
    const [notes, setNotes] = useState("")
    const [count, setCount] = useState(3)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [input, setInput] = useState(0)
    const [files, setFiles] = useState<File[]>([])
    const [drag, setDrag] = useState(false)
    const [fileError, setFileError] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")

    useEffect(() => {
        if (error) {
            const timer = setTimeout (() => setError(""), 2000)
            return () => clearTimeout(timer)
        }
        if (fileError) {
            const timer = setTimeout(() => setFileError(""), 2000)
            return () => clearTimeout(timer)
        }
    }, [error, fileError])

    async function handleGenerate() {

       if (input === 0 && !notes.trim()) {
        setError("Please enter your notes")
        return
       }

       if (input === 1 && files.length === 0) {
        setError("Please add at least one file")
        return
       }

       if (input === 2 && !question.trim()) {
        setError("Please enter a question")
        return
       }

       if (input === 2 && !answer.trim()) {
        setError("Please enter an answer")
        return
       }

       setLoading(true)
       setError("")

       try {
        if (input === 2) {
            await addCardsToDeck(deckId, [{ question, answer}])
            onSuccess()
            return
        }

        let response

        if (input === 0) {
            //text mode
            response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notes, count }),
            })
        } else {
            //file mode
            const formData = new FormData()
            files.forEach(file => formData.append("files", file))
            formData.append("count", count.toString())

            response = await fetch("/api/generate", {
                method: "POST",
                body: formData,
            })
        } 

        const data = await response.json()

        if (data.error) {
            setError(data.error)
            return
        }

        await addCardsToDeck(deckId, data.flashcards)
        onSuccess()
       } catch (e) {
        setError("Something went wrong, please try again")
       } finally {
        setLoading(false)
       }
    }

    function validateAndSetFiles(newFiles: File[]) {
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'text/markdown'
        ]
        const allowedExtensions = ['.pdf', '.docx', '.txt', '.md']
        
        const valid: File[] = []
        const errors: string[] = []

        newFiles.forEach(file => {
            const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
            if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension)) {
                errors.push(`${file.name}: unsupported file type`)
                return
            }
            if (file.size > 10 * 1024 * 1024) {
                errors.push(`${file.name}: file too large (max 10MB)`)
                return
            }
            valid.push(file)
        })

        if (errors.length > 0) setFileError(errors.join(', '))
        else setFileError("")

        setFiles(prev => [...prev, ...valid])
    }

    return (
        <div className="flex flex-col max-w-5xl mx-auto p-6">
            <button onClick={onClose} className="flex justify-center hover:text-gray-500"><X/></button>
            <div className="mt-8 mb-1 flex gap-1">
                <button 
                    onClick={() => setInput(0)}
                    disabled={input === 0}
                    className="rounded-md p-2 font-semibold transition transition-discrete duration-200 ease-in-out disabled:opacity-100 disabled:bg-gray-200 dark:disabled:bg-gray-600 hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                    Paste Text
                </button>
                <button 
                    onClick={() => setInput(1)}
                    disabled={input === 1}
                    className="rounded-md p-2 font-semibold transition transition-discrete duration-200 ease-in-out disabled:opacity-100 disabled:bg-gray-200 dark:disabled:bg-gray-600 hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                    Upload File
                </button>
                <button 
                    onClick={() => setInput(2)}
                    disabled={input === 2}
                    className="rounded-md p-2 font-semibold transition transition-discrete duration-200 ease-in-out disabled:opacity-100 disabled:bg-gray-200 dark:disabled:bg-gray-600 hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                    Own Card
                </button>
            </div>

            {input === 0 && (
            <div>
            <textarea
                placeholder="Paste your notes here..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={8}
                className="border rounded-md p-2 w-full resize-none"
            />
            </div>
            )}

            {input === 1 && (
                <div>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={e => { e.preventDefault(); setDrag(true) }}
                        onDragEnter={() => setDrag(true)}
                        onDragLeave={() => setDrag(false)}
                        onDrop={e => {
                            e.preventDefault()
                            setDrag(false)
                            const dropped = Array.from(e.dataTransfer.files)
                            if (dropped.length > 0) validateAndSetFiles(dropped)
                        }}
                        className={`border-2 rounded p-8 w-full text-center cursor-pointer transition-colors ${
                            drag ? 'border-blue-500 bg-gray-500' : 'border-dashed border-gray-300'
                            }`}
                    >
                        {files.length > 0 ? (
                            <div className="flex flex-col gap-2 w-full">
                                {files.map((f, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-700 truncate">{f.name}</span>
                                    <button
                                    onClick={e => {
                                        e.stopPropagation()
                                        setFiles(prev => prev.filter((_, i) => i !== index))
                                    }}
                                    className="text-xs text-red-400 hover:text-red-600 ml-2 shrink-0"
                                    >
                                    Remove
                                    </button>
                                </div>
                                ))}
                                <p className="text-xs text-gray-400 mt-1">Click or drop to add more files</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                <p className="text-sm">Drag & drop your files here</p>
                                <p className="text-xs">or click to browse</p>
                                <p className="text-xs mt-2">PDF, DOCX, TXT, MD - max 10MB each</p>
                            </div>
                        )}
                        <input 
                            type="file"
                            ref={fileInputRef}
                            multiple
                            className="hidden"
                            accept=".pdf,.docx,.txt,.md"
                            onChange={e => {
                                const selected = Array.from(e.target.files || [])
                                if (selected.length > 0) validateAndSetFiles(selected)
                            }}
                        />
                    </div>
                    {fileError && <p className="text-red-500 text-sm">{fileError}</p>}
                </div>
            )}

            {input === 2 && (
                <div>
                    <div>
                        <textarea
                            placeholder="Write your question here..."
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            rows={8}
                            className="border rounded p-2 w-full resize-none"
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder="Write your answer here..."
                            value={answer}
                            onChange={e => setAnswer(e.target.value)}
                            rows={8}
                            className="border rounded p-2 w-full resize-none"
                        />
                    </div>
                </div>
            )}

            {input !== 2 && (<select
                value={count}
                onChange={e => setCount(Number(e.target.value))}
                className="border dark:border-white/70 rounded-md p-2 w-full mb-3 mt-3 hover:opacity-70"
            >
                <option value={3} className="dark:bg-slate-800">3 Cards</option>
                <option value={10} className="dark:bg-slate-800">10 Cards</option>
                <option value={20} className="dark:bg-slate-800">20 Cards</option>
                <option value={30} className="dark:bg-slate-800">30 Cards</option>
            </select>)}

            {error && <p className="text-red-500">{error}</p>}

            {input === 2 ? (
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="bg-blue-500 text-white rounded-md p-2 font-semibold disabled:opacity-70 hover:opacity-70"
                >
                    {loading ? "Generating..." : "Add Flashcard"}
                </button>
            ) : (
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="bg-blue-500 text-white rounded-md p-2 font-semibold disabled:opacity-70 hover:opacity-70"
                >
                    {loading ? "Generating..." : "Generate Flashcards"}
                </button>
            )}
        </div>
    )
}   