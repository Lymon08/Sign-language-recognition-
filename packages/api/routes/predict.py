from fastapi import APIRouter, UploadFile, File, Form
import io
from api.services.video_preprocessing import preprocess_video
from api.services.inference import predict_from_frame
from api.services.analytics import log_prediction

router = APIRouter(prefix="/predict")

@router.post("/")
async def predict_sign(file: UploadFile = File(...)):
    """Predict sign language from image upload"""
    try:
        # Read the uploaded file
        contents = await file.read()
        
        # Use the model to predict from the frame
        result = predict_from_frame(contents)
        
        # Log the prediction
        log_prediction(result['label'], result['confidence'])
        
        return result
    except Exception as e:
        print(f"Error in predict endpoint: {e}")
        return {"error": str(e), "label": "error", "confidence": 0.0, "all": {}}

@router.post("/frame")
async def predict_from_single_frame(file: UploadFile = File(...)):
    """Predict sign language from a single frame"""
    try:
        # Read the uploaded frame
        contents = await file.read()
        
        # Use the model to predict
        result = predict_from_frame(contents)
        
        # Log the prediction
        log_prediction(result['label'], result['confidence'])
        
        return result
    except Exception as e:
        print(f"Error in predict_frame endpoint: {e}")
        return {"error": str(e), "label": "error", "confidence": 0.0, "all": {}}

@router.post("/log")
async def log_performance(
    studentId: str = Form(...),
    targetSign: str = Form(...),
    predictedSign: str = Form(...),
    confidence: float = Form(...),
    isCorrect: bool = Form(...),
    timestamp: str = Form(...)
):
    """Log student performance"""
    try:
        # Store performance data
        performance_data = {
            "studentId": studentId,
            "targetSign": targetSign,
            "predictedSign": predictedSign,
            "confidence": confidence,
            "isCorrect": isCorrect,
            "timestamp": timestamp
        }
        
        # Log prediction
        log_prediction(predictedSign, confidence)
        
        return {"status": "logged", "data": performance_data}
    except Exception as e:
        return {"error": str(e)}