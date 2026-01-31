from pathlib import Path
from typing import Optional, List, Dict
from ultralytics import YOLO
import numpy as np
from app.core.config import settings

class BlueprintDetector:
    """YOLO model wrapper for blueprint symbol detection"""
    
    def __init__(self, model_path: Optional[Path] = None):
        """
        Initialize the detector with a YOLO model
        
        Args:
            model_path: Path to YOLO model file (.pt)
        """
        self.model_path = model_path or settings.MODEL_PATH
        self.model = None
        self.class_names = None
        
    def load_model(self):
        """Load the YOLO model"""
        if not self.model_path.exists():
            raise FileNotFoundError(
                f"YOLO model not found at {self.model_path}. "
                f"Please place your trained YOLOv8 model (best.pt) in the models/ directory."
            )
        
        print(f"Loading YOLO model from {self.model_path}...")
        self.model = YOLO(str(self.model_path))
        self.class_names = self.model.names
        print(f"Model loaded successfully. Classes: {self.class_names}")
        
    def predict(
        self,
        image_path: Path,
        conf_threshold: Optional[float] = None,
        iou_threshold: Optional[float] = None
    ) -> List[Dict]:
        """
        Run inference on an image
        
        Args:
            image_path: Path to input image
            conf_threshold: Confidence threshold (default from settings)
            iou_threshold: IOU threshold for NMS (default from settings)
            
        Returns:
            List of detections with bbox, label, and confidence
        """
        if self.model is None:
            self.load_model()
        
        conf = conf_threshold or settings.CONFIDENCE_THRESHOLD
        iou = iou_threshold or settings.IOU_THRESHOLD
        
        # Run inference
        results = self.model.predict(
            source=str(image_path),
            conf=conf,
            iou=iou,
            verbose=False
        )
        
        # Parse results
        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                # Get box coordinates (xyxy format)
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                
                # Convert to xywh format
                x = float(x1)
                y = float(y1)
                width = float(x2 - x1)
                height = float(y2 - y1)
                
                # Get class and confidence
                class_id = int(box.cls[0].cpu().numpy())
                confidence = float(box.conf[0].cpu().numpy())
                label = self.class_names[class_id]
                
                detections.append({
                    "label": label,
                    "confidence": confidence,
                    "bbox": [x, y, width, height]
                })
        
        return detections
    
    def get_model_info(self) -> Dict:
        """Get model information"""
        if self.model is None:
            self.load_model()
            
        return {
            "model_path": str(self.model_path),
            "classes": self.class_names,
            "num_classes": len(self.class_names) if self.class_names else 0
        }

# Global detector instance
detector = BlueprintDetector()
