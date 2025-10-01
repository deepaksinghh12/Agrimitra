"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"
import { ArrowLeft, Search, ChevronDown, ExternalLink, CheckCircle } from "lucide-react"

export default function SchemesPage() {
  const [isListening, setIsListening] = useState(false)
  const [query, setQuery] = useState("")
  const [openSchemes, setOpenSchemes] = useState<string[]>([])

  const schemes = [
    {
      id: "pm-kisan",
      title: "PM-KISAN Samman Nidhi",
      titleKn: "ಪಿಎಂ-ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ",
      benefit: "₹6,000 per year",
      category: "Direct Benefit Transfer",
      eligibility: "Small & marginal farmers with landholding up to 2 hectares",
      description:
        "Direct income support to farmer families across the country to supplement their financial needs for procuring various inputs.",
      documents: ["Aadhaar Card", "Bank Account Details", "Land Records"],
      applicationLink: "https://pmkisan.gov.in",
      status: "Active",
    },
    {
      id: "drip-irrigation",
      title: "Drip Irrigation Subsidy",
      titleKn: "ಡ್ರಿಪ್ ಇರಿಗೇಷನ್ ಸಬ್ಸಿಡಿ",
      benefit: "Up to 55% subsidy",
      category: "Water Conservation",
      eligibility: "All categories of farmers",
      description:
        "Financial assistance for adoption of water efficient irrigation systems like drip and sprinkler irrigation.",
      documents: ["Land Records", "Bank Account", "Quotation from Supplier"],
      applicationLink: "https://pmksy.gov.in",
      status: "Active",
    },
    {
      id: "crop-insurance",
      title: "Pradhan Mantri Fasal Bima Yojana",
      titleKn: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬೀಮಾ ಯೋಜನೆ",
      benefit: "Crop loss compensation",
      category: "Insurance",
      eligibility: "All farmers growing notified crops",
      description: "Comprehensive risk solution for crop loss due to natural calamities, pests & diseases.",
      documents: ["Aadhaar Card", "Bank Account", "Land Records", "Sowing Certificate"],
      applicationLink: "https://pmfby.gov.in",
      status: "Active",
    },
    {
      id: "soil-health",
      title: "Soil Health Card Scheme",
      titleKn: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಯೋಜನೆ",
      benefit: "Free soil testing",
      category: "Soil Management",
      eligibility: "All farmers",
      description:
        "Provides soil nutrient status and recommendations on appropriate dosage of nutrients for improving soil health.",
      documents: ["Land Records", "Farmer ID"],
      applicationLink: "https://soilhealth.dac.gov.in",
      status: "Active",
    },
  ]

  const handleVoiceSearch = () => {
    setIsListening(true)
    setTimeout(() => {
      setIsListening(false)
      setQuery("Subsidy for drip irrigation")
    }, 2000)
  }

  const toggleScheme = (schemeId: string) => {
    setOpenSchemes((prev) => (prev.includes(schemeId) ? prev.filter((id) => id !== schemeId) : [...prev, schemeId]))
  }

  const filteredSchemes = schemes.filter(
    (scheme) =>
      scheme.title.toLowerCase().includes(query.toLowerCase()) ||
      scheme.category.toLowerCase().includes(query.toLowerCase()) ||
      scheme.description.toLowerCase().includes(query.toLowerCase()),
  )

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
            <h1 className="text-lg font-bold">🧾 Government Schemes</h1>
            <p className="text-green-100 text-sm">Find subsidies and benefits</p>
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
                  placeholder="Search schemes... (e.g., drip irrigation)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pr-10"
                />
                <Search className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
              </div>
            </div>

            <Button
              onClick={handleVoiceSearch}
              className={`w-full ${isListening ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"} transition-colors`}
              disabled={isListening}
            >
              {isListening ? (
                <>
                  <div className="w-4 h-4 bg-white rounded-full animate-pulse mr-2"></div>
                  Listening... (Kannada/English)
                </>
              ) : (
                <>🎤 Ask About Schemes</>
              )}
            </Button>

            {query && (
              <div className="text-sm text-gray-600 bg-green-50 p-2 rounded">
                <strong>Searching for:</strong> "{query}"
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Categories */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700 text-sm">🏷️ Popular Categories</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {["Subsidies", "Insurance", "Loans", "Water", "Seeds", "Equipment"].map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="cursor-pointer hover:bg-green-50 border-green-300"
                onClick={() => setQuery(category)}
              >
                {category}
              </Badge>
            ))}
          </CardContent>
        </Card>

        {/* Schemes List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-green-700 flex items-center gap-2">
            📋 Available Schemes
            <Badge variant="secondary" className="text-xs">
              {filteredSchemes.length} found
            </Badge>
          </h3>

          {filteredSchemes.map((scheme) => (
            <Card key={scheme.id} className="border-green-200">
              <Collapsible>
                <CollapsibleTrigger className="w-full" onClick={() => toggleScheme(scheme.id)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between w-full">
                      <div className="text-left">
                        <CardTitle className="text-sm font-semibold text-gray-800 mb-1">{scheme.title}</CardTitle>
                        <div className="text-xs text-gray-500 mb-2">{scheme.titleKn}</div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {scheme.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs text-green-700">
                            {scheme.benefit}
                          </Badge>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          openSchemes.includes(scheme.id) ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-4">
                    <div className="text-sm text-gray-600">{scheme.description}</div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-800 mb-2">✅ Eligibility</h4>
                        <p className="text-sm text-gray-600">{scheme.eligibility}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm text-gray-800 mb-2">📄 Required Documents</h4>
                        <div className="space-y-1">
                          {scheme.documents.map((doc, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span>{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => window.open(scheme.applicationLink, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Apply Online
                      </Button>
                      <Button size="sm" variant="outline" className="border-green-300 text-green-700 bg-transparent">
                        💬 Get Help
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        {/* Help Section */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <h4 className="font-semibold text-blue-700 mb-2">Need Help with Applications?</h4>
            <p className="text-sm text-blue-600 mb-3">Our experts can guide you through the application process</p>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              📞 Call Support: 1234567890
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
