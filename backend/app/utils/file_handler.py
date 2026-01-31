import uuid
import shutil
from pathlib import Path
from typing import Optional
from fastapi import UploadFile
from core.config import settings

def generate_unique_id() -> str:
    """Generate a unique ID for blueprints"""
    return str(uuid.uuid4())

def validate_file_extension(filename: str) -> bool:
    """Validate file extension"""
    file_ext = Path(filename).suffix.lower()
    return file_ext in settings.ALLOWED_EXTENSIONS

def save_upload_file(upload_file: UploadFile, blueprint_id: str) -> Path:
    """
    Save uploaded file to disk
    
    Args:
        upload_file: FastAPI UploadFile object
        blueprint_id: Unique blueprint ID
        
    Returns:
        Path to saved file
    """
    # Get file extension
    file_ext = Path(upload_file.filename).suffix.lower()
    
    # Create filename
    filename = f"{blueprint_id}{file_ext}"
    file_path = settings.UPLOAD_DIR / filename
    
    # Save file
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    
    return file_path

def get_blueprint_path(blueprint_id: str) -> Optional[Path]:
    """
    Get path to blueprint file
    
    Args:
        blueprint_id: Unique blueprint ID
        
    Returns:
        Path to blueprint file or None if not found
    """
    for ext in settings.ALLOWED_EXTENSIONS:
        file_path = settings.UPLOAD_DIR / f"{blueprint_id}{ext}"
        if file_path.exists():
            return file_path
    return None

def get_results_path(blueprint_id: str) -> Path:
    """Get path to results JSON file"""
    return settings.RESULTS_DIR / f"{blueprint_id}.json"

def cleanup_old_files(max_age_hours: int = 24):
    """
    Clean up old uploaded files and results
    
    Args:
        max_age_hours: Maximum age of files in hours
    """
    import time
    from datetime import datetime, timedelta
    
    cutoff_time = datetime.now() - timedelta(hours=max_age_hours)
    
    # Clean uploads
    for file_path in settings.UPLOAD_DIR.glob("*"):
        if file_path.is_file():
            file_time = datetime.fromtimestamp(file_path.stat().st_mtime)
            if file_time < cutoff_time:
                file_path.unlink()
    
    # Clean results
    for file_path in settings.RESULTS_DIR.glob("*.json"):
        file_time = datetime.fromtimestamp(file_path.stat().st_mtime)
        if file_time < cutoff_time:
            file_path.unlink()
