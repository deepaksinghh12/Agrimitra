const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
      // For some reason the SDK doesn't expose listModels nicely on the main class in some versions, 
      // but let's try to infer or use a simple check.
      // Actually, we can just try to instantiate a few and see if they work, 
      // OR better, trust the error message suggestion: "Call ListModels".
      // The SDK does have a ModelService.
      // Let's try a direct fetch if sdk fails, but SDK usually has it.
      // We will try a different approach: just try to generate content with 'gemini-pro' and 'gemini-1.5-flash' and print success/fail.
      
      const modelsToTest = ["gemini-1.5-flash", "gemini-1.5-flash-001", "gemini-1.5-flash-8b", "gemini-pro", "gemini-1.0-pro"];
      
      console.log("Testing models with key: " + (process.env.GEMINI_API_KEY ? "Present" : "Missing"));

      for (const modelName of modelsToTest) {
          process.stdout.write(`Testing ${modelName}... `);
          try {
              const model = genAI.getGenerativeModel({ model: modelName });
              const result = await model.generateContent("Hi");
              const response = await result.response;
              console.log("SUCCESS");
          } catch (e) {
              console.log("FAILED: " + e.message.split(']')[1] || e.message); // Print simple error
          }
      }
      
  } catch (e) {
    console.error("Fatal Error:", e);
  }
}

listModels();
