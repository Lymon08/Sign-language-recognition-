from fastapi import FastAPI, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
from tensorflow.keras.applications import MobileNetV2, ResNet50, VGG16
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input as mobilenet_preprocess, decode_predictions as mobilenet_decode
from tensorflow.keras.applications.resnet50 import preprocess_input as resnet_preprocess, decode_predictions as resnet_decode
from tensorflow.keras.applications.vgg16 import preprocess_input as vgg_preprocess, decode_predictions as vgg_decode
from typing import List
import time

app = FastAPI(
    title="Sign Language Recognition API",
    description="API for sign language recognition using TensorFlow",
    version="1.0.0"
)

# Load pre-trained models
print("Loading models...")
models = {
    'mobilenetv2': MobileNetV2(weights='imagenet'),
    'resnet50': ResNet50(weights='imagenet'),
    'vgg16': VGG16(weights='imagenet')
}
preprocess_funcs = {
    'mobilenetv2': mobilenet_preprocess,
    'resnet50': resnet_preprocess,
    'vgg16': vgg_preprocess
}
decode_funcs = {
    'mobilenetv2': mobilenet_decode,
    'resnet50': resnet_decode,
    'vgg16': vgg_decode
}
print("Models loaded successfully")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Base endpoint"""
    return {
        "message": "Sign Language Recognition API",
        "version": "1.0.0",
        "status": "running",
        "available_models": list(models.keys()),
        "endpoints": ["/predict", "/predict-batch", "/compare", "/models"]
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "tensorflow_version": tf.__version__,
        "models_loaded": list(models.keys())
    }

@app.get("/models")
async def get_models():
    """List available models"""
    return {
        "available_models": list(models.keys()),
        "description": "Models for image classification"
    }

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    model_name: str = Query("mobilenetv2", description="Model to use: mobilenetv2, resnet50, vgg16"),
    threshold: float = Query(0.0, ge=0.0, le=1.0, description="Confidence threshold (0-1)")
):
    """Classify image using selected model"""
    try:
        if model_name not in models:
            return {"error": f"Model '{model_name}' not found. Available: {list(models.keys())}"}
        
        start_time = time.time()
        
        # Read and process image
        image = Image.open(file.file).convert('RGB').resize((224, 224))
        img_array = np.array(image)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_funcs[model_name](img_array)
        
        # Make prediction
        model = models[model_name]
        predictions = model.predict(img_array, verbose=0)
        decoded = decode_funcs[model_name](predictions, top=5)[0]
        
        # Filter by threshold
        filtered = [
            {"label": label, "probability": float(prob)}
            for (_, label, prob) in decoded
            if prob >= threshold
        ]
        
        return {
            "model": model_name,
            "predictions": filtered if filtered else [{"label": "No predictions above threshold", "probability": 0.0}],
            "processing_time_ms": round((time.time() - start_time) * 1000, 2),
            "threshold": threshold
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/compare")
async def compare(file: UploadFile = File(...)):
    """Compare predictions across all models"""
    try:
        start_time = time.time()
        
        # Read and process image
        image = Image.open(file.file).convert('RGB').resize((224, 224))
        img_array = np.array(image)
        img_array = np.expand_dims(img_array, axis=0)
        
        results = {}
        for model_key in models:
            processed = preprocess_funcs[model_key](img_array.copy())
            predictions = models[model_key].predict(processed, verbose=0)
            decoded = decode_funcs[model_key](predictions, top=3)[0]
            results[model_key] = [
                {"label": label, "probability": float(prob)}
                for (_, label, prob) in decoded
            ]
        
        return {
            "model_comparisons": results,
            "processing_time_ms": round((time.time() - start_time) * 1000, 2)
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
