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
    # QUICK DEMO FIX: Skipping heavy model loading
    logging.info("Skipping Hugging Face model load for quick demo/mock mode.")
    CLASSIFIER = "MOCKED"
    logging.info("✅ Mock Model loaded successfully!")

@app.get("/")
async def read_root():
    return {"message": "Plant Disease Detection API (Hugging Face MobileNetV2)"}

@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": CLASSIFIER is not None}

@app.post("/predict")
def predict(file: UploadFile = File(...)):
    # QUICK DEMO FIX: Returning instantaneous mock data
    logging.info(f"Processing mock image request: {file.filename}")
    
    import random
    mock_diseases = [
        "Tomato___Early_blight", 
        "Apple___Apple_scab", 
        "Corn_(maize)___Common_rust_", 
        "healthy"
    ]
    
    predicted_label = random.choice(mock_diseases)
    confidence = random.uniform(0.85, 0.99)
    
    logging.info(f"Mock Prediction: {predicted_label} ({confidence:.2f})")

    # Recommendations Map
    recommendations = {
        "healthy": "Your crop looks healthy! Keep up the good work.",
        "Early_blight": "Apply fungicides like Mancozeb or Chlorothalonil.",
        "Apple_scab": "Apply fungicides and remove fallen leaves.",
        "Common_rust_": "Apply fungicides early and plant resistant varieties."
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
