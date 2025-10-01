"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Mic, MicOff, Volume2, RotateCcw } from "lucide-react"

export default function VoicePage() {
  const [isListening, setIsListening] = useState(false)
  const [currentQuery, setCurrentQuery] = useState("")
  const [response, setResponse] = useState("")
  const [language, setLanguage] = useState<"en" | "kn">("en")
  const [conversation, setConversation] = useState<
    Array<{ type: "user" | "assistant"; text: string; timestamp: Date }>
  >([])

  const sampleQueries = {
    en: [
      "What's the price of tomatoes today?",
      "How to treat tomato blight?",
      "Tell me about PM-KISAN scheme",
      "Best time to plant rice?",
      "Weather forecast for farming",
    ],
    kn: ["ಇಂದು ಟೊಮೇಟೊ ಬೆಲೆ ಎಷ್ಟು?", "ಟೊಮೇಟೊ ರೋಗಕ್ಕೆ ಏನು ಮಾಡಬೇಕು?", "ಪಿಎಂ-ಕಿಸಾನ್ ಯೋಜನೆ ಬಗ್ಗೆ ಹೇಳಿ", "ಅಕ್ಕಿ ನೆಡುವ ಸಮಯ ಯಾವಾಗ?", "ಹವಾಮಾನ ಮಾಹಿತಿ ಕೊಡಿ"],
  }

  const mockResponses = {
    en: {
      "What's the price of tomatoes today?":
        "Today's tomato price is ₹45 per kg at Bangalore APMC market. Prices have increased by 12% compared to yesterday due to reduced supply from Kolar region.",
      "How to treat tomato blight?":
        "For tomato blight, immediately remove affected leaves, apply copper-based fungicide, improve air circulation, and avoid overhead watering. Prevention includes planting resistant varieties.",
      "Tell me about PM-KISAN scheme":
        "PM-KISAN provides ₹6,000 per year to small and marginal farmers. The money is transferred directly to your bank account in three installments of ₹2,000 each.",
      "Best time to plant rice?":
        "In Karnataka, the best time to plant rice is during Kharif season (June-July) with the onset of monsoon. Ensure proper field preparation and use certified seeds.",
      "Weather forecast for farming":
        "This week expects moderate rainfall with temperatures between 22-28°C. Good conditions for transplanting. Avoid spraying pesticides during rainy days.",
    },
    kn: {
      "ಇಂದು ಟೊಮೇಟೊ ಬೆಲೆ ಎಷ್ಟು?":
        "ಇಂದು ಬೆಂಗಳೂರು APMC ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಟೊಮೇಟೊ ಬೆಲೆ ಕಿಲೋಗೆ ₹45. ಕೋಲಾರ್ ಪ್ರದೇಶದಿಂದ ಪೂರೈಕೆ ಕಡಿಮೆಯಾದ ಕಾರಣ ನಿನ್ನೆಗಿಂತ 12% ಹೆಚ್ಚಾಗಿದೆ.",
      "ಟೊಮೇಟೊ ರೋಗಕ್ಕೆ ಏನು ಮಾಡಬೇಕು?":
        "ಟೊಮೇಟೊ ರೋಗಕ್ಕೆ ತಕ್ಷಣ ಬಾಧಿತ ಎಲೆಗಳನ್ನು ತೆಗೆಯಿರಿ, ತಾಮ್ರದ ಔಷಧ ಸಿಂಪಡಿಸಿ, ಗಾಳಿ ಸಂಚಾರ ಸುಧಾರಿಸಿ ಮತ್ತು ಮೇಲಿನಿಂದ ನೀರು ಹಾಕಬೇಡಿ.",
      "ಪಿಎಂ-ಕಿಸಾನ್ ಯೋಜನೆ ಬಗ್ಗೆ ಹೇಳಿ":
        "ಪಿಎಂ-ಕಿಸಾನ್ ಸಣ್ಣ ಮತ್ತು ಅಂಚಿನ ರೈತರಿಗೆ ವರ್ಷಕ್ಕೆ ₹6,000 ನೀಡುತ್ತದೆ. ಈ ಹಣವನ್ನು ₹2,000 ಮೂರು ಕಂತುಗಳಲ್ಲಿ ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ವರ್ಗಾಯಿಸಲಾಗುತ್ತದೆ.",
      "ಅಕ್ಕಿ ನೆಡುವ ಸಮಯ ಯಾವಾಗ?":
        "ಕರ್ನಾಟಕದಲ್ಲಿ ಅಕ್ಕಿ ನೆಡುವ ಉತ್ತಮ ಸಮಯ ಖರೀಫ್ ಋತುವಿನಲ್ಲಿ (ಜೂನ್-ಜುಲೈ) ಮಾನ್ಸೂನ್ ಆರಂಭದೊಂದಿಗೆ. ಸರಿಯಾದ ಹೊಲ ತಯಾರಿಕೆ ಮತ್ತು ಪ್ರಮಾಣಿತ ಬೀಜಗಳನ್ನು ಬಳಸಿ.",
      "ಹವಾಮಾನ ಮಾಹಿತಿ ಕೊಡಿ": "ಈ ವಾರ ಮಧ್ಯಮ ಮಳೆ ಮತ್ತು 22-28°C ತಾಪಮಾನ ನಿರೀಕ್ಷೆ. ನಾಟಿ ಮಾಡಲು ಉತ್ತಮ ಪರಿಸ್ಥಿತಿ. ಮಳೆಯ ದಿನಗಳಲ್ಲಿ ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಬೇಡಿ.",
    },
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false)
      // Simulate processing
      setTimeout(() => {
        const queries = sampleQueries[language]
        const randomQuery = queries[Math.floor(Math.random() * queries.length)]
        setCurrentQuery(randomQuery)

        // Get response
        const responses = mockResponses[language]
        const response =
          responses[randomQuery as keyof typeof responses] || "I understand your question. Let me help you with that."

        setConversation((prev) => [
          ...prev,
          { type: "user", text: randomQuery, timestamp: new Date() },
          { type: "assistant", text: response, timestamp: new Date() },
        ])

        setResponse(response)
        setCurrentQuery("")
      }, 2000)
    } else {
      setIsListening(true)
      setCurrentQuery("")
      setResponse("")
    }
  }

  const handleSampleQuery = (query: string) => {
    setCurrentQuery(query)
    const responses = mockResponses[language]
    const response =
      responses[query as keyof typeof responses] || "I understand your question. Let me help you with that."

    setConversation((prev) => [
      ...prev,
      { type: "user", text: query, timestamp: new Date() },
      { type: "assistant", text: response, timestamp: new Date() },
    ])

    setResponse(response)
    setTimeout(() => setCurrentQuery(""), 1000)
  }

  const clearConversation = () => {
    setConversation([])
    setCurrentQuery("")
    setResponse("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white hover:bg-green-700">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold">🎤 Voice Assistant</h1>
              <p className="text-green-100 text-sm">Ask me anything about farming</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "kn" : "en")}
              className="text-white hover:bg-green-700 text-xs"
            >
              {language === "en" ? "ಕನ್ನಡ" : "English"}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* Voice Control */}
        <Card className="border-green-200">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <Button
                onClick={handleVoiceToggle}
                className={`w-24 h-24 rounded-full ${
                  isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-green-600 hover:bg-green-700"
                } transition-all duration-300`}
              >
                {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
              </Button>
            </div>

            <div className="space-y-2">
              {isListening ? (
                <>
                  <h3 className="text-lg font-semibold text-red-600">🎙️ Listening...</h3>
                  <p className="text-sm text-gray-600">
                    {language === "en" ? "Speak now in English or Kannada" : "ಈಗ ಇಂಗ್ಲಿಷ್ ಅಥವಾ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ"}
                  </p>
                  <div className="flex justify-center space-x-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-red-500 rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 20 + 10}px`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-green-700">
                    {language === "en" ? "Tap to speak" : "ಮಾತನಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === "en"
                      ? "Ask about crops, prices, schemes, or farming tips"
                      : "ಬೆಳೆಗಳು, ಬೆಲೆಗಳು, ಯೋಜನೆಗಳು ಅಥವಾ ಕೃಷಿ ಸಲಹೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ"}
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Query */}
        {currentQuery && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">👤</div>
                <div className="flex-1">
                  <Badge variant="secondary" className="text-xs mb-2">
                    {language === "en" ? "You asked" : "ನೀವು ಕೇಳಿದ್ದು"}
                  </Badge>
                  <p className="text-sm text-gray-800">{currentQuery}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Response */}
        {response && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">🤖</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {language === "en" ? "Kisan AI" : "ಕಿಸಾನ್ AI"}
                    </Badge>
                    <Button variant="ghost" size="icon" className="w-6 h-6">
                      <Volume2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-800">{response}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Conversation History */}
        {conversation.length > 0 && (
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-700 text-sm">
                  {language === "en" ? "Conversation History" : "ಸಂಭಾಷಣೆ ಇತಿಹಾಸ"}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearConversation}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {conversation.map((msg, index) => (
                  <div key={index} className={`flex gap-2 ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-2 rounded-lg text-sm ${
                        msg.type === "user" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sample Queries */}
        <Card className="border-green-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-green-700 text-sm mb-3">
              {language === "en" ? "💡 Try asking:" : "💡 ಇವುಗಳನ್ನು ಕೇಳಿ:"}
            </h4>
            <div className="space-y-2">
              {sampleQueries[language].map((query, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start text-sm h-auto p-3 border-green-200 hover:bg-green-50 bg-transparent"
                  onClick={() => handleSampleQuery(query)}
                >
                  {query}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/diagnosis">
            <Button variant="outline" className="w-full border-green-300 text-green-700 bg-transparent">
              📷 Diagnose Plant
            </Button>
          </Link>
          <Link href="/market">
            <Button variant="outline" className="w-full border-green-300 text-green-700 bg-transparent">
              💰 Check Prices
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
