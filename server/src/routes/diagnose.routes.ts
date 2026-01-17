import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// ML Service URL (Python backend)
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

router.post('/', upload.single('image'), async (req: express.Request, res: express.Response): Promise<void> => {
    if (!req.file) {
        res.status(400).json({ error: 'No image uploaded' });
        return;
    }

    try {
        // 1. Try ML Service First
        try {
            const formData = new FormData();
            formData.append('file', fs.createReadStream(req.file.path));

            const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, formData, {
                headers: {
                    ...formData.getHeaders(),
                },
            });

            // Clean up uploaded file
            fs.unlinkSync(req.file.path);

            res.json(mlResponse.data);
            return;
        } catch (mlError: any) {
            // If ML Service fails, we stop here (User requested to remove Gemini fallback)
            console.warn("ML Service failed, and Gemini fallback is disabled.");

            res.json({
                class: "ML Service Connecting...",
                confidence: 0,
                recommendation: "The AI Model is waking up. Please wait 30 seconds and try again.",
                error: "ML Service Cold Start"
            });
            return;
        }

        // Gemini Logic Removed as per request
        /* 
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        ...
        */

    } catch (error) {
        console.error("Diagnosis Error:", error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        // Even here, try to return JSON instead of 500 if possible, but 500 is technically correct for unexpected crash
        res.status(500).json({
            error: "Internal Server Error",
            details: error instanceof Error ? error.message : String(error)
        });
    }
});

export default router;
