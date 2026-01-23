def generate_feedback(confidence):
    """Generate personalized feedback based on confidence level"""
    if confidence > 0.95:
        return {
            "level": "excellent",
            "message": "Excellent sign! Perfect execution!",
            "tips": ["Your hand positioning is perfect", "Great speed and fluidity"],
            "next_action": "Try the next sign"
        }
    elif confidence > 0.9:
        return {
            "level": "very_good",
            "message": "Very good! Almost perfect!",
            "tips": ["Minor adjustment in hand angle", "Keep the motion smooth"],
            "next_action": "Practice one more time or move on"
        }
    elif confidence > 0.75:
        return {
            "level": "good",
            "message": "Good attempt! Refine your motion.",
            "tips": ["Focus on hand positioning", "Try slower, more deliberate movements"],
            "next_action": "Try again"
        }
    elif confidence > 0.6:
        return {
            "level": "okay",
            "message": "Not quite right. Let's try again.",
            "tips": ["Watch the reference video", "Pay attention to hand shape", "Focus on the motion direction"],
            "next_action": "Try again with the visual guide"
        }
    else:
        return {
            "level": "needs_work",
            "message": "Keep practicing! Watch the demo first.",
            "tips": ["Review the correct hand shape", "Practice the motion slowly", "Watch the full reference"],
            "next_action": "Watch demo and try again"
        }

def get_performance_summary(predictions_list):
    """Generate a summary of performance"""
    if not predictions_list:
        return {
            "attempts": 0,
            "accuracy": 0,
            "averageConfidence": 0,
            "summary": "No attempts yet"
        }
    
    correct = sum(1 for p in predictions_list if p.get('correct', False))
    total = len(predictions_list)
    avg_confidence = sum(p.get('confidence', 0) for p in predictions_list) / total
    
    accuracy = (correct / total * 100) if total > 0 else 0
    
    if accuracy >= 80:
        level = "Excellent progress!"
    elif accuracy >= 60:
        level = "Good progress, keep practicing!"
    elif accuracy >= 40:
        level = "You're learning, don't give up!"
    else:
        level = "Keep practicing!"
    
    return {
        "attempts": total,
        "correct": correct,
        "accuracy": accuracy,
        "averageConfidence": avg_confidence,
        "summary": level
    }