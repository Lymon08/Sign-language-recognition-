from fastapi import APIRouter, UploadFile, File, Form
from api.services.inference import predict
from api.services.feedback import generate_feedback
from api.services.video_preprocessing import preprocess_video
from api.services.analytics import log_prediction

router = APIRouter(prefix="/tutor")

@router.post("/")
async def tutor_session(file: UploadFile = File(...), target: str = Form(...)):
    """Interactive tutor session with feedback"""
    try:
        sequence = None  # In production, preprocess video
        result = predict(sequence)
        feedback = generate_feedback(result['confidence'])

        # Log the session
        log_prediction(result['label'], result['confidence'])

        return {
            "target": target,
            "prediction": result,
            "feedback": feedback,
            "correct": result['label'] == target,
            "suggestedNextStep": "Excellent progress!" if result['label'] == target else "Try again with better hand positioning"
        }
    except Exception as e:
        return {"error": str(e)}

@router.get("/modules")
def get_learning_modules():
    """Get available learning modules"""
    return {
        "modules": [
            {
                "id": 1,
                "name": "Basics",
                "signs": ["good", "hello", "goodbye"],
                "difficulty": "beginner"
            },
            {
                "id": 2,
                "name": "Greetings",
                "signs": ["hello", "good_morning", "goodbye"],
                "difficulty": "beginner"
            },
            {
                "id": 3,
                "name": "Communication",
                "signs": ["help", "meet", "nice"],
                "difficulty": "intermediate"
            },
            {
                "id": 4,
                "name": "Advanced",
                "signs": ["good", "good_morning", "goodbye", "hello", "help", "meet", "nice", "thankyou"],
                "difficulty": "advanced"
            }
        ]
    }

@router.get("/module/{module_id}")
def get_module_details(module_id: int):
    """Get detailed module information"""
    return {
        "moduleId": module_id,
        "name": "Basics",
        "description": "Learn basic sign language gestures",
        "signs": ["good", "hello", "goodbye"],
        "difficulty": "beginner",
        "estimatedTime": "30 minutes",
        "progress": 0
    }