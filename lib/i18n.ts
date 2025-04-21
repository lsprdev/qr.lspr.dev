type Translations = {
    [key: string]: {
        [key: string]: string | string[]
    }
}

export const translations: Translations = {
    "en-US": {
        title: "qr.lspr.dev",
        subtitle: "Simple and fast QR Code generator",
        inputPlaceholder: "Type or paste your link here",
        copyButton: "Copy QR",
        copiedButton: "Copied",
        downloadButton: "Download",
        refreshButton: "Refresh",
        scanInfo: "Scan with any QR Code reader 📱",
        footerText: "Made with",
        by: "by",
        copySuccess: "QR Code copied to clipboard",
        copyDescription: "CTRL+C doesn't need you anymore 😉",
        downloadSuccess: "QR Code downloaded successfully!",
        downloadDescription: "Now just share it 🚀",
        fallbackCopyTitle: "URL copied to clipboard",
        fallbackCopyDescription: "Couldn't copy the image, but the link was copied!",
        message1: "QR Code updated!",
        message2: "Fresh QR Code 📱",
        message3: "Here's your QR Code!",
        message4: "QR Code...?",
        errorTooLong: "URL is too long! Please shorten it.",
    },
    "pt-BR": {
        title: "qr.lspr.dev",
        subtitle: "Gerador de QR Code simples e rápido",
        inputPlaceholder: "Digite ou cole seu link aqui",
        copyButton: "Copiar QR",
        copiedButton: "Copiado",
        downloadButton: "Baixar",
        refreshButton: "Atualizar",
        scanInfo: "Escaneie com qualquer leitor de QR Code 📱",
        footerText: "Feito com",
        by: "por",
        copySuccess: "QR Code copiado para a área de transferência",
        copyDescription: "CTRL+C não precisa mais de você 😉",
        downloadSuccess: "QR Code baixado com sucesso!",
        downloadDescription: "Agora é só compartilhar 🚀",
        fallbackCopyTitle: "URL copiado para a área de transferência",
        fallbackCopyDescription: "Não foi possível copiar a imagem, mas o link foi copiado!",
        message1: "QR Code atualizado!",
        message2: "QR Code fresquinho 📱",
        message3: "Vai um QR Code aí?",
        message4: "QR Code...?",
        errorTooLong: "URL muito longa! Vai com calma, tá tentando quebrar tudo?...",
    },
}

export function t(key: string, language: string): string {
    // Default to en-US if language not found
    const lang = translations[language] ? language : "en-US"

    const value = translations[lang][key]

    // If the value is an array, return a random item from it
    if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)] as string
    }

    return (value as string) || key
}

// Helper function to get random message
export function getRandomMessage(language: string): string {
    const messages = [t("message1", language), t("message2", language), t("message3", language), t("message4", language)]
    return messages[Math.floor(Math.random() * messages.length)]
}
