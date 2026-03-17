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
            console.warn("ML Service failed, falling back to Gemini:", mlError.message);
            if (mlError.response) {
                console.error("ML Service Error Details:", mlError.response.data);
            }
            // Continue to Gemini fallback
        }

        // 2. Fallback to Gemini
        // Gemini Logic Removed as per request

    } catch (error) {
        console.error("Diagnosis Error:", error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            error: "Internal Server Error",
            details: error instanceof Error ? error.message : String(error)
        });
    }
});

export default router;
