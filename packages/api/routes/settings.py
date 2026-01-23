from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def settings():
    """Get application settings"""
    return {
        "audio_enabled": True,
        "confidence_threshold": 0.8,
        "language": "en-US",
        "theme": "light"
    }

@router.post("/")
def update_settings(settings_data: dict):
    """Update application settings"""
    return {
        "status": "updated",
        "settings": settings_data
    }

