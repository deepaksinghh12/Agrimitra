"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Search, TrendingUp, TrendingDown, Minus } from "lucide-react"

export default function MarketPage() {
  const [isListening, setIsListening] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null)

  const marketData = [
    {
      name: "Tomato",
      nameHi: "टमाटर",
      price: 45,
      unit: "kg",
      change: +12,
      trend: "up",
      market: "Azadpur Mandi",
    },
    {
      name: "Onion",
      nameHi: "प्याज",
      price: 28,
      unit: "kg",
      change: -5,
      trend: "down",
      market: "Nashik Mandi",
    },
    {
      name: "Rice (Basmati)",
      nameHi: "चावल (बासमती)",
      price: 95,
      unit: "kg",
      change: +2,
      trend: "up",
      market: "Karnal Mandi",
    },
    {
      name: "Potato",
      nameHi: "आलू",
      price: 22,
      unit: "kg",
      change: +8,
      trend: "up",
      market: "Agra Mandi",
    },
    {
      name: "Wheat",
      nameHi: "गेहूं",
      price: 2250,
      unit: "quintal",
      change: 0,
      trend: "stable",
      market: "Khanna Mandi",
    },
    {
      name: "Cotton",
      nameHi: "कपास",
      price: 6800,
      unit: "quintal",
      change: -200,
      trend: "down",
      market: "Rajkot Mandi",
    },
  ]

  const handleVoiceSearch = () => {
    setIsListening(true)
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false)
      setQuery("Tomato price today")
      setSelectedCrop("Tomato")
    }, 2000)
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const filteredData = marketData.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.nameHi.includes(query)
  );

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
            <h1 className="text-lg font-bold">💰 Market Prices</h1>
            <p className="text-green-100 text-sm">Real-time crop prices</p>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* Search Section */}
        <Card className="border-green-200">
          <CardContent className="p-4 space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search crop prices... (e.g., Tomato)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pr-10"
                />
                <Search className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={handleVoiceSearch}
                className={`w-full ${isListening ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"} transition-colors`}
                disabled={isListening}
              >
                {isListening ? (
                  <>
                    <div className="w-4 h-4 bg-white rounded-full animate-pulse mr-2"></div>
                    Listening... (Hindi/English)
                  </>
                ) : (
                  <>🎤 Ask Market Price</>
                )}
              </Button>
            </div>

            {query && (
              <div className="text-sm text-gray-600 bg-green-50 p-2 rounded">
                <strong>Query:</strong> "{query}"
              </div>
            )}
          </CardContent>
        </Card>

        {/* Market Summary */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-700 text-sm flex items-center gap-2">📊 Today's Market Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">12</div>
              <div className="text-xs text-gray-600">Prices Up</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">5</div>
              <div className="text-xs text-gray-600">Prices Down</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-600">8</div>
              <div className="text-xs text-gray-600">Stable</div>
            </div>
          </CardContent>
        </Card>

        {/* Price List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-green-700 flex items-center gap-2">
            📈 Current Prices
            <Badge variant="secondary" className="text-xs">
              Live
            </Badge>
          </h3>

          {filteredData.map((crop, index) => (
            <Card
              key={index}
              className={`border-green-200 hover:shadow-md transition-shadow cursor-pointer ${selectedCrop === crop.name ? "ring-2 ring-green-500 bg-green-50" : ""
                }`}
              onClick={() => setSelectedCrop(selectedCrop === crop.name ? null : crop.name)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-800">{crop.name}</h4>
                      <span className="text-sm text-gray-500">({crop.nameHi})</span>
                    </div>
                    <div className="text-xs text-gray-500">{crop.market}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-800">
                      ₹{crop.price}
                      <span className="text-sm font-normal text-gray-500">/{crop.unit}</span>
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${getTrendColor(crop.trend)}`}>
                      {getTrendIcon(crop.trend)}
                      <span>
                        {crop.change > 0 ? "+" : ""}
                        {crop.change}
                        {crop.unit === "quintal" ? "" : "%"}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedCrop === crop.name && (
                  <div className="mt-3 pt-3 border-t border-green-200 space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Yesterday</div>
                        <div className="font-semibold">₹{crop.price - crop.change}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">This Week</div>
                        <div className="font-semibold text-green-600">+5.2%</div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-green-700 border-green-300 bg-transparent"
                    >
                      📊 View Price History
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700 text-sm">⚡ Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-green-300 text-green-700 text-sm bg-transparent">
              📱 Price Alerts
            </Button>
            <Button variant="outline" className="border-green-300 text-green-700 text-sm bg-transparent">
              📍 Nearby Markets
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
