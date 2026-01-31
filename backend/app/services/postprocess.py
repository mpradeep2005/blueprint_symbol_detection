import json
from pathlib import Path
from typing import List, Dict
from app.schemas.response import Detection
from app.utils.file_handler import get_results_path

def filter_detections(
    detections: List[Dict],
    min_confidence: float = 0.25
) -> List[Dict]:
    """
    Filter detections by confidence threshold
    
    Args:
        detections: Raw detection results
        min_confidence: Minimum confidence threshold
        
    Returns:
        Filtered detections
    """
    return [
        det for det in detections
        if det["confidence"] >= min_confidence
    ]

def format_detections(detections: List[Dict]) -> List[Detection]:
    """
    Convert raw detections to Pydantic models
    
    Args:
        detections: Raw detection dictionaries
        
    Returns:
        List of Detection model instances
    """
    return [Detection(**det) for det in detections]

def save_results(blueprint_id: str, detections: List[Dict], statistics: Dict):
    """
    Save detection results to JSON file
    
    Args:
        blueprint_id: Unique blueprint ID
        detections: List of detections
        statistics: Detection statistics
    """
    results = {
        "id": blueprint_id,
        "detections": detections,
        "statistics": statistics
    }
    
    results_path = get_results_path(blueprint_id)
    with results_path.open("w") as f:
        json.dump(results, f, indent=2)

def load_results(blueprint_id: str) -> Dict:
    """
    Load detection results from JSON file
    
    Args:
        blueprint_id: Unique blueprint ID
        
    Returns:
        Results dictionary
        
    Raises:
        FileNotFoundError: If results file doesn't exist
    """
    results_path = get_results_path(blueprint_id)
    
    if not results_path.exists():
        raise FileNotFoundError(f"Results not found for blueprint ID: {blueprint_id}")
    
    with results_path.open("r") as f:
        return json.load(f)

def process_and_save_results(
    blueprint_id: str,
    raw_detections: List[Dict],
    statistics: Dict
) -> Dict:
    """
    Process raw detections and save to disk
    
    Args:
        blueprint_id: Unique blueprint ID
        raw_detections: Raw YOLO detections
        statistics: Detection statistics
        
    Returns:
        Processed results dictionary
    """
    # Filter low-confidence detections
    filtered_detections = filter_detections(raw_detections)
    
    # Save to disk
    save_results(blueprint_id, filtered_detections, statistics)
    
    return {
        "id": blueprint_id,
        "detections": filtered_detections,
        "statistics": statistics,
        "total_detections": len(filtered_detections)
    }
