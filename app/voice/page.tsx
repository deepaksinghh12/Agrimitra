"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Mic, MicOff, Volume2, RotateCcw, Loader2, Camera, Send } from "lucide-react";

// Add type definition for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoicePage() {
  const [isListening, setIsListening] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [textInput, setTextInput] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [conversation, setConversation] = useState<
    Array<{ role: "user" | "assistant"; content: string; timestamp: Date }>
  >([]);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize Speech Synthesis
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }

    // Initialize Speech Recognition
    if (typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCurrentQuery(transcript);
        handleSendQuery(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      // Set language for recognition
      if (recognitionRef.current) {
        recognitionRef.current.lang = language === "en" ? "en-IN" : "hi-IN";
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.error(e);
        }
      } else {
        alert("Voice recognition not supported in this browser.");
      }
    }
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;

    // Cancel current speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Attempt to pick a Hindi voice if available
    if (language === 'hi') {
      const voices = synthRef.current.getVoices();
      const hindiVoice = voices.find(v => v.lang.includes('hi'));
      if (hindiVoice) utterance.voice = hindiVoice;
    }
    utterance.lang = language === "en" ? "en-IN" : "hi-IN";

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const handleSendQuery = async (query: string, imageBase64?: string) => {
    if (!query.trim()) return;

    // Add user message immediately
    const userMsg = {
      role: "user" as const,
      content: imageBase64 ? (language === 'en' ? "[Image] " + query : "[फोटो] " + query) : query,
      timestamp: new Date()
    };
    setConversation(prev => [...prev, userMsg]);
    setTextInput(""); // Clear text input
    setLoading(true);

    try {
      // Prepare history for API (exclude timestamps, just role/content)
      const history = conversation.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, history, language, image: imageBase64 }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      const assistantMsg = { role: "assistant" as const, content: data.response, timestamp: new Date() };
      setConversation(prev => [...prev, assistantMsg]);

      // Auto-speak response
      speak(data.response);

    } catch (error) {
      console.error(error);
      setConversation(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting to the server. Please check your internet connection.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
      setCurrentQuery("");
    }
  };

  const sampleQueries = {
    en: [
      "What's the price of tomatoes?",
      "How to treat blight?",
      "Tell me about PM-KISAN",
    ],
    hi: ["टमाटर का भाव क्या है?", "झुलसा रोग का इलाज?", "पीएम-किसान योजना"],
  };

  return (
    <div className="min-h-screen bg-green-50 p-4 pb-32 font-sans">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-green-100">
                <ArrowLeft className="w-5 h-5 text-green-700" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-green-800">
              {language === 'en' ? 'AI Assistant' : 'एआई सहायक'}
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

        {/* Conversation Area */}
        <div className="space-y-4 min-h-[60vh]">
          {conversation.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              <p className="mb-2 text-3xl">👋</p>
              <p className="mb-2 font-medium">{language === 'en' ? "Hi! I'm AgriMitra." : "नमस्ते! मैं एग्री-मित्र हूँ।"}</p>
              <p className="text-sm">{language === 'en' ? "Ask me anything about farming." : "खेती के बारे में कुछ भी पूछें।"}</p>
            </div>
          )}

          {conversation.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                  ? 'bg-green-600 text-white rounded-br-none'
                  : 'bg-white border border-green-100 text-gray-800 rounded-bl-none'
                }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-green-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                <span className="text-xs text-gray-500">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Controls (Fixed) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-green-100 p-4 shadow-lg z-10">
          <div className="max-w-md mx-auto flex flex-col items-center gap-3">

            {/* Suggestions */}
            {conversation.length === 0 && (
              <div className="flex gap-2 overflow-x-auto w-full pb-2 no-scrollbar">
                {sampleQueries[language].map((q, i) => (
                  <Button key={i} variant="outline" size="sm" className="whitespace-nowrap flex-shrink-0 text-gray-600 border-gray-300" onClick={() => handleSendQuery(q)}>
                    {q}
                  </Button>
                ))}
              </div>
            )}

            <div className="w-full flex items-center gap-2">
              {/* Image Upload Button */}
              <div className="relative flex-shrink-0">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="chat-image-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const base64 = ev.target?.result as string;
                        handleSendQuery(language === 'en' ? "What is this?" : "यह क्या है?", base64);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <label htmlFor="chat-image-upload">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full w-10 h-10 bg-gray-100 text-gray-600 hover:bg-gray-200"
                    asChild
                  >
                    <span className="cursor-pointer">
                      <Camera className="w-5 h-5" />
                    </span>
                  </Button>
                </label>
              </div>

              {/* Text Input */}
              <Input
                className="flex-1 rounded-full border-gray-300 focus-visible:ring-green-500 bg-gray-50"
                placeholder={language === 'en' ? "Type or speak..." : "लिखें या बोलें..."}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendQuery(textInput);
                }}
              />

              {/* Send / Mic Button */}
              {textInput.trim() ? (
                <Button
                  size="icon"
                  className="rounded-full w-10 h-10 bg-green-600 hover:bg-green-700 text-white shadow-md flex-shrink-0"
                  onClick={() => handleSendQuery(textInput)}
                >
                  <Send className="w-5 h-5" />
                </Button>
              ) : (
                <Button
                  size="icon"
                  className={`rounded-full w-10 h-10 shadow-md flex-shrink-0 transition-all duration-300 ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-green-600 hover:bg-green-700'}`}
                  onClick={toggleListening}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
              )}
            </div>

            {isListening && (
              <p className="text-xs text-red-500 font-medium animate-pulse">
                {language === 'en' ? "Listening..." : "सुन रहा हूँ..."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
