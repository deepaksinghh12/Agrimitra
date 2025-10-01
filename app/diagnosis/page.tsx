"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { ArrowLeft, Camera, Upload, Loader2, CheckCircle, AlertTriangle } from "lucide-react"

export default function DiagnosisPage() {
  const [step, setStep] = useState<"upload" | "analyzing" | "result">("upload")
  const [progress, setProgress] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        analyzeImage()
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = () => {
    setStep("analyzing")
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setStep("result")
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const mockResult = {
    disease: "Tomato Late Blight",
    confidence: 94,
    severity: "Moderate",
    description:
      "Late blight is a serious disease affecting tomato plants, caused by the fungus Phytophthora infestans.",
    symptoms: [
      "Dark brown spots on leaves",
      "White fuzzy growth on leaf undersides",
      "Rapid spreading in humid conditions",
    ],
    remedies: [
      "Remove affected leaves immediately",
      "Apply copper-based fungicide",
      "Improve air circulation",
      "Avoid overhead watering",
    ],
    prevention: ["Plant resistant varieties", "Ensure proper spacing", "Water at soil level"],
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
            <h1 className="text-lg font-bold">🪴 Crop Diagnosis</h1>
            <p className="text-green-100 text-sm">AI-powered plant disease detection</p>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-4">
        {step === "upload" && (
          <>
            {/* Upload Section */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700 text-center">📷 Take or Upload Plant Photo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <label htmlFor="camera-input">
                    <Button className="w-full h-20 bg-green-600 hover:bg-green-700 flex-col gap-2">
                      <Camera className="w-6 h-6" />
                      <span className="text-sm">Take Photo</span>
                    </Button>
                    <input
                      id="camera-input"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>

                  <label htmlFor="upload-input">
                    <Button
                      variant="outline"
                      className="w-full h-20 border-green-300 text-green-700 hover:bg-green-50 flex-col gap-2 bg-transparent"
                    >
                      <Upload className="w-6 h-6" />
                      <span className="text-sm">Upload Photo</span>
                    </Button>
                    <input
                      id="upload-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                <div className="text-center text-sm text-gray-600 space-y-2">
                  <p>
                    📋 <strong>Tips for best results:</strong>
                  </p>
                  <ul className="text-left space-y-1 bg-green-50 p-3 rounded-lg">
                    <li>• Take clear, well-lit photos</li>
                    <li>• Focus on affected plant parts</li>
                    <li>• Include leaves, stems, or fruits</li>
                    <li>• Avoid blurry or dark images</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Recent Diagnoses */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700 text-sm">📊 Recent Diagnoses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-200 rounded"></div>
                    <div>
                      <div className="text-sm font-medium">Tomato Blight</div>
                      <div className="text-xs text-gray-500">2 hours ago</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    94%
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-200 rounded"></div>
                    <div>
                      <div className="text-sm font-medium">Healthy Plant</div>
                      <div className="text-xs text-gray-500">Yesterday</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    98%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {step === "analyzing" && (
          <Card className="border-green-200">
            <CardContent className="p-6 text-center space-y-4">
              {selectedImage && (
                <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden">
                  <img
                    src={selectedImage || "/placeholder.svg"}
                    alt="Uploaded plant"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-3">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-green-600" />
                <h3 className="text-lg font-semibold text-green-700">🔍 Analyzing your plant...</h3>
                <p className="text-sm text-gray-600">Our AI is examining the image for diseases and pests</p>

                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-xs text-gray-500">{progress}% Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "result" && (
          <>
            {/* Result Header */}
            <Card className="border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  {selectedImage && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      <img
                        src={selectedImage || "/placeholder.svg"}
                        alt="Analyzed plant"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      <h3 className="font-semibold text-gray-800">{mockResult.disease}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {mockResult.confidence}% Confidence
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {mockResult.severity}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{mockResult.description}</p>
              </CardContent>
            </Card>

            {/* Symptoms */}
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-700 text-sm flex items-center gap-2">🔍 Symptoms Detected</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mockResult.symptoms.map((symptom, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>{symptom}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Remedies */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700 text-sm flex items-center gap-2">
                  💊 Recommended Treatment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mockResult.remedies.map((remedy, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-green-600">{index + 1}</span>
                    </div>
                    <span>{remedy}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Prevention */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-700 text-sm flex items-center gap-2">🛡️ Prevention Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mockResult.prevention.map((tip, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span>{tip}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => {
                  setStep("upload")
                  setSelectedImage(null)
                  setProgress(0)
                }}
                variant="outline"
                className="border-green-300 text-green-700"
              >
                📷 New Diagnosis
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">💬 Ask Expert</Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
