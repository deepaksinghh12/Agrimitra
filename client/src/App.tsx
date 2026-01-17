import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, TrendingUp, Settings, Wifi, WifiOff } from "lucide-react"

// Types
type Language = "en" | "gu";

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
  gu: {
    title: "એગ્રી-મિત્ર",
    subtitle: "તમારો AI ખેડૂત મિત્ર",
    cropDiagnosis: "પાક રોગ નિદાન",
    cropDesc: "છોડના રોગો ઓળખવા માટે ફોટો લો",
    marketPrices: "બજાર ભાવ તપાસો",
    marketDesc: "પાકના રીયલ-ટાઇમ ભાવ મેળવો",
    govSchemes: "સરકારી યોજનાઓ",
    schemesDesc: "સબસિડી અને લાભો શોધો",
    voiceAssistant: "વોઇસ આસિસ્ટન્ટ",
    voiceDesc: "ખેતી વિશે કંઈ પણ પૂછો",
    offline: "ઓફલાઇન મોડ",
    online: "ઓનલાઇન",
  },
}

function HomePage() {
  const [isOnline] = useState(true) // Helper to detect online status could be added
  const [language, setLanguage] = useState<Language>("en")

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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(prev => prev === "en" ? "gu" : "en")}
              className="text-white hover:bg-green-700 font-bold border border-white/20"
            >
              {language === "en" ? "ગુજરાતી" : "English"}
            </Button>
            <Link to="/settings">
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
            <Link to="/voice">
              <Button className="bg-white text-green-600 hover:bg-green-50 font-semibold px-8 py-3 rounded-full">
                🎤 {language === "en" ? "Start Voice Chat" : "વાતચીત શરૂ કરો"}
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <div className="grid gap-4">
          {/* Crop Diagnosis */}
          <Link to="/diagnosis" className="block">
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
          <Link to="/market" className="block">
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
          <Link to="/schemes" className="block">
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

          {/* Weather Dashboard */}
          <Link to="/weather" className="block">
            <Card className="hover:shadow-lg transition-shadow border-green-200 hover:border-green-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-green-700">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">🌦️</div>
                  <div>
                    <div className="font-semibold">{language === "en" ? "Live Weather" : "मौसम का हाल"}</div>
                    <div className="text-sm text-gray-600 font-normal">{language === "en" ? "Check forecasts" : "पूर्वानुमान देखें"}</div>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>



          {/* Community Forum */}
          <Link to="/forum" className="block">
            <Card className="hover:shadow-lg transition-shadow border-green-200 hover:border-green-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-green-700">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">👥</div>
                  <div>
                    <div className="font-semibold">{language === "en" ? "Farmer Forum" : "ખેડૂત ચર્ચા"}</div>
                    <div className="text-sm text-gray-600 font-normal">{language === "en" ? "Ask & Share tips" : "પ્રશ્નો પૂછો અને ટીપ્સ શેર કરો"}</div>
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

import DiagnosisPage from "./pages/DiagnosisPage";
import MarketPage from "./pages/MarketPage";
import SchemesPage from "./pages/SchemesPage";
import WeatherPage from "./pages/WeatherPage";
import ForumPage from "./pages/ForumPage";

import SettingsPage from "./pages/SettingsPage";
import VoicePage from "./pages/VoicePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/voice" element={<VoicePage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/schemes" element={<SchemesPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/diagnosis" element={<DiagnosisPage />} />
        <Route path="/forum" element={<ForumPage />} />
      </Routes>
    </Router>
  )
}
