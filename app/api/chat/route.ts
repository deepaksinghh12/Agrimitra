import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { message, history, language, image } = await req.json();

        // Fallback to 'gemini-pro' as 'gemini-1.5-flash' returned 404
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Context for the AI
        const systemInstruction = `You are AgriMitra, a helpful AI farming assistant for Indian farmers. 
    The user is asking in ${language === 'hi' ? 'Hindi' : 'English'}.
    Reply in the SAME language as the user (${language === 'hi' ? 'Hindi' : 'English'}).
    Keep answers concise, practical, and easy to understand. 
    Focus on Indian agriculture context (crops, seasons, government schemes like PM-KISAN).
    If asked about prices, give approximate current market estimates for Karnataka/India but mention they vary.
    If an image is provided, analyze it as an expert agronomist (identify crop, disease, or text).`;

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemInstruction }],
                },
                {
                    role: "model",
                    parts: [{ text: `Understood. I am AgriMitra. I will answer in ${language === 'hi' ? 'Hindi' : 'English'} and help with Indian farming.` }],
                },
                ...history.map((msg: any) => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }],
                })),
            ],
        });

        // Prepare prompt content (text + optional image)
        const promptParts: any[] = [{ text: message }];

        if (image) {
            // image should be base64 string without data:image/Prefix
            const base64Data = image.split(",")[1];
            promptParts.push({
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg", // Assuming jpeg/png, standard base64 usually works
                },
            });
        }

        const result = await chat.sendMessage(promptParts);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ response: text });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json({
            error: "Failed to process request",
            details: error.message || String(error)
        }, { status: 500 });
    }
}
