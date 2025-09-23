from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import logging
from pathlib import Path
from pydantic import BaseModel, Field
import uuid
from datetime import datetime

# Import routes
from routes.auth_routes import router as auth_router
from routes.character_routes import router as character_router
from routes.animation_routes import router as animation_router
from routes.processing_routes import router as processing_router
from database import init_database, close_database

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app without a prefix
app = FastAPI(
    title="Mixamo Clone API",
    description="3D Character Animation Platform API",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Legacy routes for compatibility
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

@api_router.get("/")
async def root():
    return {
        "message": "Mixamo Clone API", 
        "version": "1.0.0",
        "status": "running"
    }

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# File serving endpoint
@api_router.get("/files/{filename}")
async def get_file(filename: str):
    """Serve uploaded files"""
    file_path = Path("uploads") / filename
    
    # Check in subdirectories
    for subdir in ["characters", "animations", "thumbnails", "processed"]:
        potential_path = Path("uploads") / subdir / filename
        if potential_path.exists():
            return FileResponse(
                potential_path,
                headers={"Content-Disposition": f"inline; filename={filename}"}
            )
    
    if file_path.exists():
        return FileResponse(
            file_path,
            headers={"Content-Disposition": f"inline; filename={filename}"}
        )
    
    raise HTTPException(status_code=404, detail="File not found")

# Include all routers
api_router.include_router(auth_router)
api_router.include_router(character_router)
api_router.include_router(animation_router)
api_router.include_router(processing_router)

# Include the main router in the app
app.include_router(api_router)

# Serve static files (uploads)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    await init_database()
    logger.info("Mixamo Clone API started successfully")

@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection on shutdown"""
    await close_database()
    logger.info("Mixamo Clone API shut down")
