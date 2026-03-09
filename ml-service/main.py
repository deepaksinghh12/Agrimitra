from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
from PIL import Image
from PIL import Image
from io import BytesIO
from transformers import pipeline
import cv2
import numpy as np

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

def auto_crop_image(pil_img: Image.Image) -> tuple[Image.Image, bool]:
    """
    Intelligently slices off excessive background noise around a dominant leaf using HSV color bounding and contours.
    Returns: (Cropped_Image or Original, is_plant_detected boolean)
    """
    try:
        # Convert PIL to specific OpenCV format
        open_cv_image = np.array(pil_img)
        # Convert RGB to BGR 
        img = open_cv_image[:, :, ::-1].copy()
        
        # Convert to HSV color space for easier green/plant detection
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        
        # Define broad range of green (healthy) and yellow/brown (diseased) colors
        lower_bound = np.array([20, 20, 20])
        upper_bound = np.array([100, 255, 255])
        
        # Threshold the HSV image to get only plant colors
        mask = cv2.inRange(hsv, lower_bound, upper_bound)
        
        # Calculate the percentage of plant-colored pixels in the entire image
        total_pixels = open_cv_image.shape[0] * open_cv_image.shape[1]
        plant_pixels = cv2.countNonZero(mask)
        plant_ratio = plant_pixels / total_pixels
        
        # If less than 2% of the image contains plant colors, it's likely not a plant
        if plant_ratio < 0.02:
            logging.warning(f"Rejection: Low plant pixel ratio detected ({plant_ratio:.2%})")
            return (pil_img, False)

        # Find contours
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if not contours:
            return (pil_img, False) # No plant contour detected

        # Find the largest contour (assuming it's the primary leaf)
        largest_contour = max(contours, key=cv2.contourArea)
        
        # Ignore if the detected blob is incredibly small and likely noise
        if cv2.contourArea(largest_contour) < 500:
            return (pil_img, False)
            
        # Get bounding box coordinates padding slightly
        x, y, w, h = cv2.boundingRect(largest_contour)
        
        # Extract the ROI (Region of Interest)
        cropped = img[max(0, y-20):y+h+20, max(0, x-20):x+w+20]
        
        # Convert back to PIL Image
        cropped_rgb = cv2.cvtColor(cropped, cv2.COLOR_BGR2RGB)
        return (Image.fromarray(cropped_rgb), True)
        
    except Exception as e:
        logging.warning(f"Auto-crop/filtering failed, falling back to original image: {e}")
        return (pil_img, True)  # Fallback to leniency on error

@app.on_event("startup")
async def startup_event():
    global CLASSIFIER
    try:
        logging.info(f"Loading Hugging Face model: {MODEL_ID}...")
        import torch
        device = 0 if torch.cuda.is_available() else -1
        CLASSIFIER = pipeline("image-classification", model=MODEL_ID, framework="pt", device=device)
        
        logging.info("Warming up model with dummy image...")
        dummy_image = Image.new('RGB', (224, 224), color = 'green')
        CLASSIFIER(dummy_image)
        
        logging.info(f"✅ Model loaded successfully on device: {'GPU' if device == 0 else 'CPU'}!")
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
def predict(file: UploadFile = File(...)):
    if CLASSIFIER is None:
        return {"error": "Model not loaded", "class": "Error", "confidence": 0}

    try:
        logging.info(f"Processing image: {file.filename}")
        image_data = file.file.read()
        image = Image.open(BytesIO(image_data)).convert("RGB")
        
        # Resize to speed up pipeline processing
        image.thumbnail((512, 512), Image.Resampling.LANCZOS)
        
        # Isolate the leaf payload and reject non-plants
        cropped_image, is_plant = auto_crop_image(image)
        if not is_plant:
            logging.info("Image rejected: No plant detected.")
            return {
                "class": "Not a Plant Detected",
                "confidence": 0.0,
                "recommendation": "Please upload a clear, focused picture of a crop leaf."
            }

        # Predict
        results = CLASSIFIER(cropped_image)
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
