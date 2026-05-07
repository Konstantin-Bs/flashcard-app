import { AuthProvider } from "@/lib/auth-context"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "next-themes"

export const metadata: Metadata = {
  title: "FlashAI",
  description: "AI-powered flashcard generator",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-slate-950 min-h-screen pt-16 text-slate-950 dark:text-white flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Header/>
            <div className="flex-1">
              {children}
            </div>
            <Footer/>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}