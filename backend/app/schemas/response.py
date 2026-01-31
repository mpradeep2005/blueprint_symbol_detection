from pydantic import BaseModel, Field
from typing import List, Optional

class BoundingBox(BaseModel):
    """Bounding box coordinates [x, y, width, height]"""
    x: float = Field(..., description="X coordinate of top-left corner")
    y: float = Field(..., description="Y coordinate of top-left corner")
    width: float = Field(..., description="Width of bounding box")
    height: float = Field(..., description="Height of bounding box")

class Detection(BaseModel):
    """Single detection result"""
    label: str = Field(..., description="Detection class label (wall, door, window, room)")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score")
    bbox: List[float] = Field(..., description="Bounding box [x, y, width, height]")

class UploadResponse(BaseModel):
    """Response for successful file upload"""
    id: str = Field(..., description="Unique blueprint ID")
    filename: str = Field(..., description="Original filename")
    message: str = Field(default="File uploaded successfully")

class DetectionResponse(BaseModel):
    """Response for detection request"""
    id: str = Field(..., description="Blueprint ID")
    total_detections: int = Field(..., description="Total number of detections")
    detections: List[Detection] = Field(..., description="List of detected elements")
    message: str = Field(default="Detection completed successfully")

class ResultsResponse(BaseModel):
    """Response for results retrieval"""
    id: str = Field(..., description="Blueprint ID")
    detections: List[Detection] = Field(..., description="List of detected elements")
    statistics: dict = Field(..., description="Detection statistics by type")

class ErrorResponse(BaseModel):
    """Error response"""
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Detailed error information")
