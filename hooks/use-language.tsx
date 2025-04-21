"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Language = "en-US" | "pt-BR"

type LanguageContextType = {
    language: Language
    setLanguage: (language: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>("en-US")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // Get language from localStorage on mount
        const storedLanguage = localStorage.getItem("language") as Language
        if (storedLanguage && (storedLanguage === "en-US" || storedLanguage === "pt-BR")) {
            setLanguageState(storedLanguage)
        } else {
            // Try to detect browser language
            const browserLanguage = navigator.language
            if (browserLanguage.startsWith("pt")) {
                setLanguageState("pt-BR")
            }
        }
        setMounted(true)
    }, [])

    const setLanguage = (newLanguage: Language) => {
        setLanguageState(newLanguage)
        localStorage.setItem("language", newLanguage)
    }

    // Only render children after we've determined the language
    if (!mounted) {
        return null
    }

    return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider")
    }
    return context
}
