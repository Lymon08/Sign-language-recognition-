from datetime import datetime
from typing import Dict, List

# In-memory storage (in production, use a database)
analytics_store: List[Dict] = []

def log_prediction(label: str, confidence: float):
    """Log a prediction to the analytics store"""
    analytics_store.append({
        "label": label,
        "confidence": confidence,
        "timestamp": datetime.utcnow().isoformat()
    })

def get_dashboard_metrics():
    """Get overall dashboard metrics"""
    total = len(analytics_store)
    per_label = {}

    for item in analytics_store:
        label = item.get("label", "unknown")
        per_label[label] = per_label.get(label, 0) + 1

    return {
        "total_predictions": total,
        "usage_by_label": per_label
    }

def get_student_performance(student_id: str):
    """Get performance metrics for a specific student"""
    # In production, query from database
    return {
        "studentId": student_id,
        "totalAttempts": 45,
        "correctPredictions": 38,
        "accuracy": 84.4,
        "averageConfidence": 0.82
    }

def log_student_session(student_id: str, sign_data: Dict):
    """Log a student practice session"""
    session_data = {
        "studentId": student_id,
        "timestamp": datetime.utcnow().isoformat(),
        **sign_data
    }
    analytics_store.append(session_data)
    return session_data
