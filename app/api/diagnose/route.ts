import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file = data.get("image") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No image provided" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString("base64");

        // Fallback to 'gemini-pro-vision' (for images) as 'gemini-1.5-flash' returned 404
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

        const prompt = `Analyze this plant image for diseases. 
    Return ONLY a valid JSON object (no markdown, no backticks) with this structure:
    {
      "disease": "Name of disease or 'Healthy'",
      "confidence": number (0-100),
      "severity": "Low" | "Moderate" | "High" (if healthy, use "None"),
      "description": "Brief explanation of the condition",
      "symptoms": ["symptom1", "symptom2"],
      "remedies": ["remedy1", "remedy2"],
      "prevention": ["prevention1", "prevention2"]
    }
    If the image is not a plant, return:
    {
      "disease": "Not a Plant",
      "confidence": 0,
      "severity": "None",
      "description": "Please upload a clear image of a plant leaf or crop.",
      "symptoms": [],
      "remedies": [],
      "prevention": []
    }`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: file.type,
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean up markdown if present (e.g. ```json ... ```)
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            const jsonResponse = JSON.parse(cleanedText);
            return NextResponse.json(jsonResponse);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError, "Raw Text:", text);
            return NextResponse.json(
                { error: "Failed to parse AI response" },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error("Diagnosis Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
