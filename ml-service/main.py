from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
from PIL import Image
from io import BytesIO
from transformers import pipeline

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CLASSIFIER = None
MODEL_ID = "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification"

@app.on_event("startup")
async def startup_event():
    global CLASSIFIER
    try:
        logging.info(f"Loading Hugging Face model: {MODEL_ID}...")
        # Explicitly request PyTorch
        CLASSIFIER = pipeline("image-classification", model=MODEL_ID, framework="pt")
        logging.info("✅ Model loaded successfully!")
    except Exception as e:
        import sys
        import traceback
        error_msg = f"Failed to load model: {e}\n{traceback.format_exc()}"
        sys.stderr.write(error_msg)
        with open("startup_error.txt", "w") as f:
            f.write(error_msg)
        logging.error(f"Failed to load model: {e}")

@app.get("/")
async def read_root():
    return {"message": "Plant Disease Detection API (Hugging Face MobileNetV2)"}

@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": CLASSIFIER is not None}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if CLASSIFIER is None:
        return {"error": "Model not loaded", "class": "Error", "confidence": 0}

    try:
        logging.info(f"Processing image: {file.filename}")
        image_data = await file.read()
        image = Image.open(BytesIO(image_data)).convert("RGB")
        
        # Predict
        results = CLASSIFIER(image)
        # results example: [{'label': 'Tomato___Early_blight', 'score': 0.98}, ...]
        
        top_result = results[0]
        predicted_label = top_result['label']
        confidence = top_result['score']
        
        logging.info(f"Prediction: {predicted_label} ({confidence:.2f})")

        # Recommendations Map (Best effort match based on common dataset labels)
        recommendations = {
            "healthy": "Your crop looks healthy! Keep up the good work.",
            "Bacterial_spot": "Use copper-based bactericides.",
            "Early_blight": "Apply fungicides like Mancozeb or Chlorothalonil.",
            "Late_blight": "Monitor weather and apply appropriate fungicides.",
            "Leaf_Mold": "Improve air circulation and reduce humidity.",
            "Powdery_mildew": "Use sulfur-based fungicides or neem oil.",
            "Common_rust": "Apply fungicides early and plant resistant varieties.",
            "Northern_Leaf_Blight": "Use resistant hybrids and fungicides.",
            "Black_rot": "Remove infected plant parts and use fungicides.",
            "Esca": "Prune infected areas; no cure for established vines.",
            "Leaf_blight": "Use appropriate fungicides.",
            "Haunglongbing": "Remove infected trees; control pysllids.",
            "Leaf_scorch": "Ensure proper watering and nutrition.",
            "Septoria_leaf_spot": "Remove infected leaves and use fungicides.",
            "Spider_mites": "Use miticides or neem oil.",
            "Target_Spot": "Apply fungicides and improve aeration.",
            "Mosaic_virus": "Remove infected plants; control aphids.",
            "Yellow_Leaf_Curl": "Control whiteflies; use resistant varieties."
        }
        
        rec_text = "Consult an expert for detailed advice."
        for key, value in recommendations.items():
            if key in predicted_label:
                rec_text = value
                break

        return {
            "class": predicted_label.replace("_", " "),
            "confidence": float(confidence),
            "recommendation": rec_text
        }
        
    except Exception as e:
        logging.error(f"Prediction Error: {e}")
        import traceback
        traceback.print_exc()
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
