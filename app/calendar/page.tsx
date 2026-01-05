"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Calendar, Sprout, Droplets, Bug, Loader2 } from "lucide-react"

export default function CalendarPage() {
    const [loading, setLoading] = useState(false)
    const [schedule, setSchedule] = useState<any[]>([])
    const [formData, setFormData] = useState({
        crop: "",
        date: "",
        region: "",
    })
    const [language, setLanguage] = useState<"en" | "hi">("en")

    const handleGenerate = async () => {
        if (!formData.crop || !formData.date) return

        setLoading(true)
        setSchedule([])

        try {
            const response = await fetch("/api/calendar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, language }),
            })

            if (!response.ok) throw new Error("Failed")

            const data = await response.json()
            setSchedule(data)
        } catch (error) {
            console.error(error)
            alert("Failed to generate calendar. Try again.")
        } finally {
            setLoading(false)
        }
    }

    const getActivityIcon = (text: string) => {
        const t = text.toLowerCase()
        if (t.includes("water") || t.includes("irrigation") || t.includes("पाजी")) return <Droplets className="w-4 h-4 text-blue-500" />
        if (t.includes("pest") || t.includes("insect") || t.includes("कीट")) return <Bug className="w-4 h-4 text-red-500" />
        return <Sprout className="w-4 h-4 text-green-500" />
    }

    return (
        <div className="min-h-screen bg-green-50 p-4 font-sans">
            <div className="max-w-md mx-auto space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/">
                            <Button variant="ghost" size="icon" className="hover:bg-green-100">
                                <ArrowLeft className="w-5 h-5 text-green-700" />
                            </Button>
                        </Link>
                        <h1 className="text-xl font-bold text-green-800">
                            {language === "en" ? "Smart Calendar" : "स्मार्ट कैलेंडर"}
                        </h1>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                        className="bg-white text-green-700 border-green-200"
                    >
                        {language === "en" ? "हिंदी" : "English"}
                    </Button>
                </div>

                {/* Input Form */}
                <Card className="border-green-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-green-800 text-base">
                            {language === "en" ? "Create Your Schedule" : "अपना कार्यक्रम बनाएं"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">
                                {language === "en" ? "Crop Name" : "फसल का नाम"}
                            </label>
                            <Input
                                list="crop-suggestions"
                                placeholder={language === "en" ? "e.g., Wheat, Tomato" : "जैसे- गेहूं, टमाटर"}
                                value={formData.crop}
                                onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                            />
                            <datalist id="crop-suggestions">
                                <option value="Wheat (Gehu)" />
                                <option value="Rice/Paddy (Dhan)" />
                                <option value="Tomato" />
                                <option value="Potato" />
                                <option value="Cotton" />
                                <option value="Sugarcane" />
                                <option value="Maize" />
                                <option value="Onion" />
                                <option value="Mustard" />
                            </datalist>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">
                                {language === "en" ? "Sowing Date" : "बुवाई की तारीख"}
                            </label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">
                                {language === "en" ? "Region (Optional)" : "क्षेत्र (वैकल्पिक)"}
                            </label>
                            <Input
                                list="region-suggestions"
                                placeholder={language === "en" ? "e.g., Punjab, Karnataka" : "जैसे- पंजाब, कर्नाटक"}
                                value={formData.region}
                                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                            />
                            <datalist id="region-suggestions">
                                <option value="Punjab" />
                                <option value="Haryana" />
                                <option value="Uttar Pradesh" />
                                <option value="Madhya Pradesh" />
                                <option value="Maharashtra" />
                                <option value="Karnataka" />
                                <option value="Andhra Pradesh" />
                                <option value="Tamil Nadu" />
                                <option value="Bihar" />
                                <option value="West Bengal" />
                            </datalist>
                        </div>

                        <Button
                            className="w-full bg-green-600 hover:bg-green-700 font-bold"
                            onClick={handleGenerate}
                            disabled={loading || !formData.crop || !formData.date}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Calendar className="w-4 h-4 mr-2" />}
                            {language === "en" ? "Generate Calendar" : "कैलेंडर बनाएं"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Results */}
                {schedule.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-green-800 flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            {language === "en" ? "Your Farming Plan" : "आपकी खेती योजना"}
                        </h3>

                        {schedule.map((item, idx) => (
                            <Card key={idx} className="border-l-4 border-l-green-500 border-t-0 border-r-0 border-b border-green-100 shadow-sm">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                                            {language === "en" ? `Week ${item.week}` : `सप्ताह ${item.week}`}
                                        </Badge>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{item.stage}</span>
                                    </div>

                                    <div className="space-y-2">
                                        <ul className="space-y-2">
                                            {item.activities.map((act: string, i: number) => (
                                                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                                    <span className="mt-0.5">{getActivityIcon(act)}</span>
                                                    {act}
                                                </li>
                                            ))}
                                        </ul>
                                        {item.advisory && (
                                            <div className="bg-amber-50 p-2 rounded text-xs text-amber-800 mt-2 border border-amber-100">
                                                💡 {item.advisory}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
