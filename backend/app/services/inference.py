from pathlib import Path
from typing import List, Dict
from app.models.detector import detector
from app.core.config import settings

def run_inference(image_path: Path) -> List[Dict]:
    """
    Run YOLO inference on a blueprint image
    
    Args:
        image_path: Path to blueprint image
        
    Returns:
        List of raw detection results
    """
    try:
        detections = detector.predict(
            image_path=image_path,
            conf_threshold=settings.CONFIDENCE_THRESHOLD,
            iou_threshold=settings.IOU_THRESHOLD
        )
        return detections
    except Exception as e:
        raise RuntimeError(f"Inference failed: {str(e)}")

def get_detection_statistics(detections: List[Dict]) -> Dict:
    """
    Calculate statistics from detections
    
    Args:
        detections: List of detection dictionaries
        
    Returns:
        Statistics dictionary
    """
    stats = {
        "total": len(detections),
        "by_type": {},
        "avg_confidence": 0.0
    }
    
    if not detections:
        return stats
    
    # Count by type
    total_confidence = 0.0
    for det in detections:
        label = det["label"]
        stats["by_type"][label] = stats["by_type"].get(label, 0) + 1
        total_confidence += det["confidence"]
    
    # Average confidence
    stats["avg_confidence"] = total_confidence / len(detections)
    
    return stats
