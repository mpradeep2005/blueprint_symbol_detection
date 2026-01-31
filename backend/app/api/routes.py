from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path

from schemas.response import (
    UploadResponse,
    DetectionResponse,
    ResultsResponse,
    ErrorResponse
)
from utils.file_handler import (
    generate_unique_id,
    validate_file_extension,
    save_upload_file,
    get_blueprint_path
)
from services.inference import run_inference, get_detection_statistics
from services.postprocess import process_and_save_results, load_results
from core.config import settings

router = APIRouter()

@router.post("/upload", response_model=UploadResponse)
async def upload_blueprint(file: UploadFile = File(...)):
    """
    Upload a blueprint image
    
    - **file**: Blueprint image file (JPG, PNG)
    
    Returns unique blueprint ID for later detection/retrieval
    """
    # Validate file extension
    if not validate_file_extension(file.filename):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file extension. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )
    
    # Generate unique ID
    blueprint_id = generate_unique_id()
    
    try:
        # Save file
        file_path = save_upload_file(file, blueprint_id)
        
        return UploadResponse(
            id=blueprint_id,
            filename=file.filename,
            message="File uploaded successfully"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.post("/detect/{blueprint_id}", response_model=DetectionResponse)
async def detect_elements(blueprint_id: str):
    """
    Run YOLO detection on uploaded blueprint
    
    - **blueprint_id**: Unique blueprint ID from upload
    
    Returns detection results with bounding boxes and labels
    """
    # Get blueprint file path
    file_path = get_blueprint_path(blueprint_id)
    if not file_path:
        raise HTTPException(
            status_code=404,
            detail=f"Blueprint not found: {blueprint_id}"
        )
    
    try:
        # Run inference
        raw_detections = run_inference(file_path)
        
        # Calculate statistics
        statistics = get_detection_statistics(raw_detections)
        
        # Process and save results
        results = process_and_save_results(
            blueprint_id,
            raw_detections,
            statistics
        )
        
        return DetectionResponse(
            id=blueprint_id,
            total_detections=results["total_detections"],
            detections=results["detections"],
            message="Detection completed successfully"
        )
    
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Detection failed: {str(e)}"
        )

@router.get("/results/{blueprint_id}", response_model=ResultsResponse)
async def get_results(blueprint_id: str):
    """
    Get detection results for a blueprint
    
    - **blueprint_id**: Unique blueprint ID
    
    Returns saved detection results and statistics
    """
    try:
        results = load_results(blueprint_id)
        
        return ResultsResponse(
            id=results["id"],
            detections=results["detections"],
            statistics=results["statistics"]
        )
    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail=f"Results not found for blueprint ID: {blueprint_id}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load results: {str(e)}"
        )

@router.get("/blueprints/{blueprint_id}")
async def get_blueprint_image(blueprint_id: str):
    """
    Get uploaded blueprint image
    
    - **blueprint_id**: Unique blueprint ID
    
    Returns the blueprint image file
    """
    file_path = get_blueprint_path(blueprint_id)
    if not file_path:
        raise HTTPException(
            status_code=404,
            detail=f"Blueprint image not found: {blueprint_id}"
        )
    
    return FileResponse(file_path)

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION
    }
