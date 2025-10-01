"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { ArrowLeft, Globe, Bell, Smartphone, Info, HelpCircle, Star } from "lucide-react"

export default function SettingsPage() {
  const [language, setLanguage] = useState<"en" | "kn">("en")
  const [notifications, setNotifications] = useState(true)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [offlineMode, setOfflineMode] = useState(false)

  const text = {
    en: {
      title: "Settings",
      subtitle: "Customize your experience",
      language: "Language",
      languageDesc: "Choose your preferred language",
      notifications: "Notifications",
      notificationsDesc: "Get alerts for prices and weather",
      voice: "Voice Features",
      voiceDesc: "Enable voice commands and responses",
      offline: "Offline Mode",
      offlineDesc: "Use basic features without internet",
      about: "About AgriMitra",
      aboutDesc: "Version 1.0.0 - AI Farming Assistant",
      help: "Help & Support",
      helpDesc: "Get help and contact support",
      feedback: "Send Feedback",
      feedbackDesc: "Help us improve the app",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
    },
    kn: {
      title: "ಸೆಟ್ಟಿಂಗ್ಸ್",
      subtitle: "ನಿಮ್ಮ ಅನುಭವವನ್ನು ಕಸ್ಟಮೈಸ್ ಮಾಡಿ",
      language: "ಭಾಷೆ",
      languageDesc: "ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      notifications: "ಅಧಿಸೂಚನೆಗಳು",
      notificationsDesc: "ಬೆಲೆಗಳು ಮತ್ತು ಹವಾಮಾನಕ್ಕಾಗಿ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪಡೆಯಿರಿ",
      voice: "ಧ್ವನಿ ವೈಶಿಷ್ಟ್ಯಗಳು",
      voiceDesc: "ಧ್ವನಿ ಆಜ್ಞೆಗಳು ಮತ್ತು ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ",
      offline: "ಆಫ್‌ಲೈನ್ ಮೋಡ್",
      offlineDesc: "ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆ ಮೂಲಭೂತ ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಬಳಸಿ",
      about: "ಪ್ರಾಜೆಕ್ಟ್ ಕಿಸಾನ್ ಬಗ್ಗೆ",
      aboutDesc: "ಆವೃತ್ತಿ 1.0.0 - AI ಕೃಷಿ ಸಹಾಯಕ",
      help: "ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ",
      helpDesc: "ಸಹಾಯ ಪಡೆಯಿರಿ ಮತ್ತು ಬೆಂಬಲವನ್ನು ಸಂಪರ್ಕಿಸಿ",
      feedback: "ಪ್ರತಿಕ್ರಿಯೆ ಕಳುಹಿಸಿ",
      feedbackDesc: "ಅಪ್ಲಿಕೇಶನ್ ಸುಧಾರಿಸಲು ನಮಗೆ ಸಹಾಯ ಮಾಡಿ",
      privacy: "ಗೌಪ್ಯತೆ ನೀತಿ",
      terms: "ಸೇವೆಯ ನಿಯಮಗಳು",
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 shadow-lg">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-green-700">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold">⚙️ {text[language].title}</h1>
            <p className="text-green-100 text-sm">{text[language].subtitle}</p>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* Language Settings */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700 text-sm flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {text[language].language}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">{text[language].languageDesc}</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={language === "en" ? "default" : "outline"}
                className={`${language === "en" ? "bg-green-600 hover:bg-green-700" : "border-green-300 text-green-700"}`}
                onClick={() => setLanguage("en")}
              >
                English
              </Button>
              <Button
                variant={language === "kn" ? "default" : "outline"}
                className={`${language === "kn" ? "bg-green-600 hover:bg-green-700" : "border-green-300 text-green-700"}`}
                onClick={() => setLanguage("kn")}
              >
                ಕನ್ನಡ
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700 text-sm">🔧 App Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-gray-600" />
                <div>
                  <div className="font-medium text-sm">{text[language].notifications}</div>
                  <div className="text-xs text-gray-500">{text[language].notificationsDesc}</div>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            {/* Voice Features */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-gray-600" />
                <div>
                  <div className="font-medium text-sm">{text[language].voice}</div>
                  <div className="text-xs text-gray-500">{text[language].voiceDesc}</div>
                </div>
              </div>
              <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
            </div>

            {/* Offline Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 text-gray-600">📱</div>
                <div>
                  <div className="font-medium text-sm">{text[language].offline}</div>
                  <div className="text-xs text-gray-500">{text[language].offlineDesc}</div>
                </div>
              </div>
              <Switch checked={offlineMode} onCheckedChange={setOfflineMode} />
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="border-green-200">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-green-600" />
              <div>
                <div className="font-medium text-sm">{text[language].about}</div>
                <div className="text-xs text-gray-500">{text[language].aboutDesc}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center pt-2 border-t border-green-100">
              <div>
                <div className="text-lg font-bold text-green-600">1.2K</div>
                <div className="text-xs text-gray-500">Users</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">94%</div>
                <div className="text-xs text-gray-500">Accuracy</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">4.8</div>
                <div className="text-xs text-gray-500">Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support & Help */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700 text-sm">🤝 Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start border-green-300 text-green-700 bg-transparent">
              <HelpCircle className="w-4 h-4 mr-2" />
              {text[language].help}
            </Button>

            <Button variant="outline" className="w-full justify-start border-green-300 text-green-700 bg-transparent">
              <Star className="w-4 h-4 mr-2" />
              {text[language].feedback}
            </Button>

            <div className="pt-2 border-t border-green-100 space-y-2">
              <Button variant="ghost" className="w-full justify-start text-sm text-gray-600">
                {text[language].privacy}
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm text-gray-600">
                {text[language].terms}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <h4 className="font-semibold text-red-700 mb-2">🚨 Emergency Support</h4>
            <p className="text-sm text-red-600 mb-3">For urgent farming issues or technical problems</p>
            <Button size="sm" className="bg-red-600 hover:bg-red-700">
              📞 Call: 1234567890
            </Button>
          </CardContent>
        </Card>

        {/* App Version */}
        <div className="text-center text-xs text-gray-500 pt-4">AgriMitra • Made with ❤️ by Akshay</div>
      </div>
    </div>
  )
}
