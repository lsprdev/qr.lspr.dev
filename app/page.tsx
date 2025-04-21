"use client"

import { useState, useEffect, useRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner" // Usando Sonner para toasts [^1]

export default function Home() {
  const [url, setUrl] = useState("")
  const [qrValue, setQrValue] = useState("https://qr.lspr.dev")
  const qrRef = useRef<HTMLDivElement>(null)

  // Atualiza o QR Code quando o usuário digita
  useEffect(() => {
    const timer = setTimeout(() => {
      if (url) {
        setQrValue(url)
        toast.success("QR Code gerado com sucesso!")
      }
    }, 500) // Pequeno delay para evitar muitas atualizações

    return () => clearTimeout(timer)
  }, [url])

  // Função para baixar o QR Code como PNG
  const downloadQRCode = () => {
    if (!qrRef.current) return

    const svg = qrRef.current.querySelector("svg")
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")

      const downloadLink = document.createElement("a")
      downloadLink.download = "qrcode.png"
      downloadLink.href = pngFile
      downloadLink.click()

      toast.success("QR Code baixado com sucesso!")
    }

    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-white">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">qr.lspr.dev</h1>
          <p className="text-gray-500 mt-2">Gerador de QR Code simples e rápido</p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <Input
                type="text"
                placeholder="Digite ou cole seu link aqui"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full"
              />

              <div ref={qrRef} className="flex justify-center p-6 bg-gray-50 rounded-md">
                <QRCodeSVG
                  value={qrValue}
                  size={200}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"H"}
                  includeMargin={false}
                />
              </div>

              <Button onClick={downloadQRCode} className="w-full">
                <Download className="mr-2 h-4 w-4" /> Baixar QR Code
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
