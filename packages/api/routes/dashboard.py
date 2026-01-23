from fastapi import APIRouter
from api.services.analytics import get_dashboard_metrics

router = APIRouter()

@router.get("/")
def dashboard():
    """Get overall dashboard metrics"""
    return get_dashboard_metrics()

@router.get("/students")
def get_students():
    """Get list of all students"""
    return {
        "students": [
            {"id": "student_1", "name": "Lymon Sithole"},
            {"id": "student_2", "name": "Brandon Mutewera"},
            {"id": "student_3", "name": "Louis Sithole"},
            {"id": "student_4", "name": "Rodric Ndlovu"}
        ]
    }

@router.get("/student/{student_id}")
def get_student_stats(student_id: str):
    """Get specific student statistics"""
    return {
        "studentId": student_id,
        "totalAttempts": 45,
        "correctPredictions": 38,
        "accuracy": 84.4,
        "averageConfidence": 0.82,
        "signPerformance": {}
    }

@router.get("/performance/{student_id}")
def get_student_performance(student_id: str, sign: str = None):
    """Get student performance for specific sign"""
    return {
        "studentId": student_id,
        "sign": sign,
        "attempts": 5,
        "successful": 4,
        "successRate": 0.8,
        "averageConfidence": 0.85
    }

@router.get("/signs/{sign}")
def get_sign_statistics(sign: str):
    """Get statistics for a specific sign"""
    return {
        "sign": sign,
        "totalAttempts": 120,
        "successfulAttempts": 100,
        "successRate": 0.833,
        "averageConfidence": 0.87,
        "studentCount": 12
    }
