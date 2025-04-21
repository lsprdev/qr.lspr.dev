"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage()
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <div className="flex gap-2">
            <Button
                variant="ghost"
                size="icon"
                className={`w-8 h-8 rounded-full ${language === "pt-BR" ? "opacity-100" : "opacity-50"}`}
                onClick={() => setLanguage("pt-BR")}
                aria-label="Mudar para Português"
            >
                🇧🇷
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className={`w-8 h-8 rounded-full ${language === "en-US" ? "opacity-100" : "opacity-50"}`}
                onClick={() => setLanguage("en-US")}
                aria-label="Switch to English"
            >
                🇺🇸
            </Button>
        </div>
    )
}
