"use client"

import { useState, useEffect, useRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/hooks/use-language"
import { t, getRandomMessage } from "@/lib/i18n"

const MAX_URL_LENGTH = 200 // Define a maximum length for the URL

export default function QrGenerator() {
  const { language } = useLanguage()
  const [url, setUrl] = useState<string>("")
  const [qrValue, setQrValue] = useState<string>("https://qr.lspr.dev")
  const [copied, setCopied] = useState<boolean>(false)
  const [animating, setAnimating] = useState<boolean>(false)
  const qrRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Easter egg in console
    console.log("%cFeito por lspr.dev", "color: #888; font-size: 12px; font-style: italic;")
    console.log("%c⚡ Bem-vindo ao gerador de QR Code!", "color: #3b82f6; font-size: 14px; font-weight: bold;")
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (url.length > MAX_URL_LENGTH) {
        toast({
          title: t("errorTooLong", language),
          duration: 2000,
        })
        return
      }

      if (url) {
        setAnimating(true)
        setQrValue(url)

        toast({
          title: getRandomMessage(language),
          duration: 2000,
        })

        setTimeout(() => setAnimating(false), 300)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [url, language])

  const downloadQRCode = () => {
    if (!qrRef.current) return

    const svg = qrRef.current.querySelector("svg")
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.crossOrigin = "anonymous"

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")

      const downloadLink = document.createElement("a")
      downloadLink.download = "qrcode.png"
      downloadLink.href = pngFile
      downloadLink.click()

      toast({
        title: t("downloadSuccess", language),
        description: t("downloadDescription", language),
        duration: 2000,
      })
    }

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
  }

  const copyToClipboard = async () => {
    try {
      if (!qrRef.current) return
      const svg = qrRef.current.querySelector("svg")
      if (!svg) return

      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.crossOrigin = "anonymous"

      img.onload = async () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)

        canvas.toBlob(async (blob) => {
          if (blob) {
            const clipboardItem = new ClipboardItem({ "image/png": blob })
            await navigator.clipboard.write([clipboardItem])
            setCopied(true)
            toast({
              title: t("copySuccess", language),
              description: t("copyDescription", language),
              duration: 2000,
            })
          }
        })
      }

      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
    } catch (err) {
      console.error("Error copying to clipboard:", err)
      await navigator.clipboard.writeText(qrValue)
      setCopied(true)
      toast({
        title: t("fallbackCopyTitle", language),
        description: t("fallbackCopyDescription", language),
        duration: 2000,
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 relative">
      <div className="absolute top-4 left-4 text-xs text-muted uppercase tracking-widest rotate-[-4deg]">
        <span className="bg-black text-white px-2 py-1 rounded-sm">lsprlabs</span>
      </div>

      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md text-center">
        <h1
          className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-mono"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            textShadow: "0 0 6px rgba(100, 108, 255, 0.2)",
          }}
        >
          {t("title", language)}
        </h1>
        <p className="mt-2 text-gray-500">{t("subtitle", language)}</p>

        <Card className="mt-8 overflow-hidden border-0 shadow-sm">
          <CardContent className="p-6">
            <Input
              type="text"
              placeholder={t("inputPlaceholder", language)}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mb-4"
            />
            <div
              ref={qrRef}
              className={`mb-6 rounded-md bg-gray-50 p-4 transition-transform duration-300 flex justify-center ${animating ? "scale-105" : "scale-100"
                }`}
            >
              <QRCodeSVG
                value={qrValue || "https://qr.lspr.dev"}
                size={200}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
                includeMargin={false}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={copyToClipboard}
                className="flex-1 gap-2 bg-[#111827] hover:bg-[#1f2937] text-white rounded-md h-12"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1"
                >
                  <rect
                    x="9"
                    y="9"
                    width="10"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {copied ? t("copiedButton", language) : t("copyButton", language)}
              </Button>
              <Button
                onClick={downloadQRCode}
                variant="outline"
                className="flex-1 gap-2 border border-gray-300 hover:border-gray-400 bg-white text-[#111827] rounded-md h-12"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1"
                >
                  <path
                    d="M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 3L12 15M12 15L16 11M12 15L8 11"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t("downloadButton", language)}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-sm text-gray-500">
          <p>{t("scanInfo", language)}</p>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4 italic">
          {t("footerText", language)} <Zap size={12} className="inline text-yellow-500" /> {t("by", language)}{" "}
          <a href="https://lspr.dev" className="underline hover:text-gray-700 transition-colors">
            lspr.dev
          </a>
        </p>
      </div>
      <Toaster />
    </div>
  )
}
