"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, CloudRain, Sun, Wind, Droplets, MapPin, Loader2, Thermometer } from "lucide-react"

export default function WeatherPage() {
    const [loading, setLoading] = useState(false)
    const [weather, setWeather] = useState<any>(null)
    const [city, setCity] = useState("New Delhi")
    const [language, setLanguage] = useState<"en" | "hi">("en")

    // Geocoding map for simple demo (In real app, use geocoding API)
    const cityCoords: Record<string, { lat: number, lon: number }> = {
        "New Delhi": { lat: 28.61, lon: 77.20 },
        "Mumbai": { lat: 19.07, lon: 72.87 },
        "Bangalore": { lat: 12.97, lon: 77.59 },
        "Chennai": { lat: 13.08, lon: 80.27 },
        "Kolkata": { lat: 22.57, lon: 88.36 },
        "Pune": { lat: 18.52, lon: 73.85 },
        "Hyderabad": { lat: 17.38, lon: 78.48 },
        "Ahmedabad": { lat: 23.02, lon: 72.57 },
        "Jaipur": { lat: 26.91, lon: 75.78 },
        "Lucknow": { lat: 26.84, lon: 80.94 }
    }

    const fetchWeather = async () => {
        setLoading(true)
        try {
            // Default to Delhi if not found
            const coords = cityCoords[city] || cityCoords["New Delhi"];

            const res = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
            );
            const data = await res.json();
            setWeather(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchWeather();
    }, [])

    const getWeatherIcon = (code: number) => {
        if (code === 0 || code === 1) return <Sun className="w-12 h-12 text-yellow-500" />;
        if (code > 50) return <CloudRain className="w-12 h-12 text-blue-500" />;
        return <Sun className="w-12 h-12 text-gray-400" />; // Default/Cloudy
    }

    const getWeatherDesc = (code: number) => {
        if (code === 0) return language === "en" ? "Clear Sky" : "साफ़ आसमान";
        if (code > 0 && code < 4) return language === "en" ? "Partly Cloudy" : "थोड़े बादल";
        if (code >= 51) return language === "en" ? "Rainy" : "बारिश";
        return language === "en" ? "Cloudy" : "बादल छाए रहेंगे";
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
                            {language === "en" ? "Live Weather" : "मौसम का हाल"}
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

                {/* Search */}
                <div className="flex gap-2">
                    <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Enter city (e.g., Pune)"
                        className="bg-white"
                    />
                    <Button onClick={fetchWeather} className="bg-green-600 hover:bg-green-700">
                        <SearchIcon />
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                    </div>
                ) : weather && (
                    <div className="space-y-4">
                        {/* Current Weather Card */}
                        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                            <CardContent className="p-6 text-center">
                                <div className="flex items-center justify-center gap-2 mb-4 opacity-90">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm font-medium">{city}</span>
                                </div>

                                <div className="mb-4">
                                    {getWeatherIcon(weather.current.weather_code)}
                                </div>

                                <div className="text-5xl font-bold mb-2">
                                    {weather.current.temperature_2m}°
                                </div>
                                <div className="text-lg font-medium opacity-90 mb-6">
                                    {getWeatherDesc(weather.current.weather_code)}
                                </div>

                                <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-4">
                                    <div>
                                        <div className="text-blue-100 text-xs mb-1">Wind</div>
                                        <div className="font-bold flex items-center justify-center gap-1">
                                            <Wind className="w-3 h-3" />
                                            {weather.current.wind_speed_10m}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-blue-100 text-xs mb-1">Humidity</div>
                                        <div className="font-bold flex items-center justify-center gap-1">
                                            <Droplets className="w-3 h-3" />
                                            {weather.current.relative_humidity_2m}%
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-blue-100 text-xs mb-1">Precip</div>
                                        <div className="font-bold flex items-center justify-center gap-1">
                                            <CloudRain className="w-3 h-3" />
                                            0mm
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Forecast */}
                        <h3 className="font-semibold text-green-800">
                            {language === "en" ? "5-Day Forecast" : "५ दिनों का पूर्वानुमान"}
                        </h3>

                        <div className="grid gap-2">
                            {weather.daily.time.slice(1, 6).map((time: string, i: number) => (
                                <Card key={time} className="border-green-100">
                                    <CardContent className="p-3 flex items-center justify-between">
                                        <div className="text-sm font-medium text-gray-600">
                                            {new Date(time).toLocaleDateString(language === 'en' ? 'en-US' : 'hi-IN', { weekday: 'long' })}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {getWeatherIcon(weather.daily.weather_code[i + 1])}
                                            <div className="text-right">
                                                <div className="font-bold text-gray-800">
                                                    {weather.daily.temperature_2m_max[i + 1]}° / {weather.daily.temperature_2m_min[i + 1]}°
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {getWeatherDesc(weather.daily.weather_code[i + 1])}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function SearchIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}
