"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Mic, TrendingUp, Settings, Wifi, WifiOff } from "lucide-react"

export default function HomePage() {
  const [isOnline, setIsOnline] = useState(true)
  const [language, setLanguage] = useState<"en" | "kn">("en")

  const text = {
    en: {
      title: "AgriMitra",
      subtitle: "Your AI Farming Assistant",
      cropDiagnosis: "Diagnose Crop Diseases",
      cropDesc: "Take a photo to identify plant diseases",
      marketPrices: "Check Market Prices",
      marketDesc: "Get real-time crop prices",
      govSchemes: "Government Schemes",
      schemesDesc: "Find subsidies and benefits",
      voiceAssistant: "Voice Assistant",
      voiceDesc: "Ask me anything about farming",
      offline: "Offline Mode",
      online: "Online",
    },
    kn: {
      title: "ಪ್ರಾಜೆಕ್ಟ್ ಕಿಸಾನ್",
      subtitle: "ನಿಮ್ಮ AI ಕೃಷಿ ಸಹಾಯಕ",
      cropDiagnosis: "ಬೆಳೆ ರೋಗ ನಿರ್ಣಯ",
      cropDesc: "ಸಸ್ಯ ರೋಗಗಳನ್ನು ಗುರುತಿಸಲು ಫೋಟೋ ತೆಗೆಯಿರಿ",
      marketPrices: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
      marketDesc: "ನೈಜ ಸಮಯದ ಬೆಳೆ ಬೆಲೆಗಳನ್ನು ಪಡೆಯಿರಿ",
      govSchemes: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
      schemesDesc: "ಸಬ್ಸಿಡಿ ಮತ್ತು ಪ್ರಯೋಜನಗಳನ್ನು ಹುಡುಕಿ",
      voiceAssistant: "ಧ್ವನಿ ಸಹಾಯಕ",
      voiceDesc: "ಕೃಷಿಯ ಬಗ್ಗೆ ಏನು ಬೇಕಾದರೂ ಕೇಳಿ",
      offline: "ಆಫ್‌ಲೈನ್ ಮೋಡ್",
      online: "ಆನ್‌ಲೈನ್",
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <h1 className="text-xl font-bold">🧑‍🌾 {text[language].title}</h1>
            <p className="text-green-100 text-sm">{text[language].subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isOnline ? "default" : "destructive"} className="text-xs">
              {isOnline ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
              {isOnline ? text[language].online : text[language].offline}
            </Badge>
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="text-white hover:bg-green-700">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* Voice Assistant - Central Feature */}
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                <Mic className="w-10 h-10" />
              </div>
              <h2 className="text-lg font-semibold mb-2">{text[language].voiceAssistant}</h2>
              <p className="text-green-100 text-sm mb-4">{text[language].voiceDesc}</p>
            </div>
            <Link href="/voice">
              <Button className="bg-white text-green-600 hover:bg-green-50 font-semibold px-8 py-3 rounded-full">
                🎤 {language === "en" ? "Start Voice Chat" : "ಧ್ವನಿ ಚಾಟ್ ಪ್ರಾರಂಭಿಸಿ"}
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <div className="grid gap-4">
          {/* Crop Diagnosis */}
          <Link href="/diagnosis">
            <Card className="hover:shadow-lg transition-shadow border-green-200 hover:border-green-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-green-700">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">📷</div>
                  <div>
                    <div className="font-semibold">{text[language].cropDiagnosis}</div>
                    <div className="text-sm text-gray-600 font-normal">{text[language].cropDesc}</div>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>

          {/* Market Prices */}
          <Link href="/market">
            <Card className="hover:shadow-lg transition-shadow border-green-200 hover:border-green-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-green-700">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">💰</div>
                  <div>
                    <div className="font-semibold">{text[language].marketPrices}</div>
                    <div className="text-sm text-gray-600 font-normal">{text[language].marketDesc}</div>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>

          {/* Government Schemes */}
          <Link href="/schemes">
            <Card className="hover:shadow-lg transition-shadow border-green-200 hover:border-green-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-green-700">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">🧾</div>
                  <div>
                    <div className="font-semibold">{text[language].govSchemes}</div>
                    <div className="text-sm text-gray-600 font-normal">{text[language].schemesDesc}</div>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Quick Stats */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="text-center">
                <div className="font-semibold text-amber-700">🌾 Today</div>
                <div className="text-amber-600">3 Queries</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-amber-700">📈 Trend</div>
                <div className="text-amber-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12%
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-amber-700">🎯 Accuracy</div>
                <div className="text-amber-600">94%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
