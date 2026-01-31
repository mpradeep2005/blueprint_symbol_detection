from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api import routes
from app.models.detector import detector

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events - startup and shutdown"""
    # Startup: Load YOLO model
    print("Starting Blueprint Detection API...")
    try:
        detector.load_model()
        print("✓ YOLO model loaded successfully")
    except FileNotFoundError as e:
        print(f"⚠ Warning: {e}")
        print("  The API will start, but detection will fail until you add your YOLO model.")
    except Exception as e:
        print(f"✗ Error loading model: {e}")
    
    yield
    
    # Shutdown
    print("Shutting down Blueprint Detection API...")

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered blueprint detection API using YOLOv8",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(routes.router, prefix="", tags=["Blueprint Detection"])

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Blueprint Detection API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
