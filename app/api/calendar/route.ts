import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { crop, date, region, language } = await req.json();

        // Fallback to 'gemini-pro' as 'gemini-1.5-flash' returned 404
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        Act as an expert agronomist for India. Generate a week-by-week farming calendar for:
        Crop: ${crop}
        Sowing Date: ${date}
        Region: ${region || "General India"}
        Language: ${language === 'hi' ? 'Hindi' : 'English'}

        Return strictly a valid JSON array of objects. NO markdown, NO backticks.
        Structure:
        [
            {
                "week": 1,
                "stage": "Stage Name (e.g., Sowing/Germination)",
                "activities": ["Activity 1", "Activity 2"],
                "advisory": "Specific tip for this stage"
            },
            ...
        ]
        
        Cover the entire lifecycle from sowing to harvest (approx 12-20 weeks depending on crop).
        If Language is Hindi, return ALL text in Hindi.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        console.log("Gemini Response:", responseText); // Debug log

        // Robust JSON Extraction: Find first '[' and last ']'
        const start = responseText.indexOf('[');
        const end = responseText.lastIndexOf(']');

        if (start === -1 || end === -1) {
            throw new Error("Invalid JSON format from AI");
        }

        const cleanJson = responseText.substring(start, end + 1);
        const schedule = JSON.parse(cleanJson);

        return NextResponse.json(schedule);

    } catch (error) {
        console.error("Calendar generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate calendar. Please try again." },
            { status: 500 }
        );
    }
}
