import aiofiles
import os
import uuid
from pathlib import Path
from typing import Optional
from fastapi import UploadFile, HTTPException
from PIL import Image
import io

# File upload configuration
UPLOAD_DIR = Path("uploads")
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB
ALLOWED_MODEL_EXTENSIONS = {".fbx", ".obj", ".dae", ".gltf", ".glb"}
ALLOWED_ANIMATION_EXTENSIONS = {".fbx", ".bvh", ".anim"}
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

# Create upload directories
UPLOAD_DIR.mkdir(exist_ok=True)
(UPLOAD_DIR / "characters").mkdir(exist_ok=True)
(UPLOAD_DIR / "animations").mkdir(exist_ok=True)
(UPLOAD_DIR / "thumbnails").mkdir(exist_ok=True)
(UPLOAD_DIR / "processed").mkdir(exist_ok=True)

def get_file_extension(filename: str) -> str:
    """Get file extension in lowercase"""
    return Path(filename).suffix.lower()

def generate_unique_filename(original_filename: str) -> str:
    """Generate unique filename while preserving extension"""
    extension = get_file_extension(original_filename)
    unique_id = str(uuid.uuid4())
    return f"{unique_id}{extension}"

async def validate_file_size(file: UploadFile) -> None:
    """Validate file size"""
    # Read file to check size
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB"
        )
    
    # Reset file pointer
    await file.seek(0)

async def save_uploaded_file(file: UploadFile, subdirectory: str) -> str:
    """Save uploaded file and return the file path"""
    await validate_file_size(file)
    
    # Generate unique filename
    unique_filename = generate_unique_filename(file.filename)
    file_path = UPLOAD_DIR / subdirectory / unique_filename
    
    # Save file
    async with aiofiles.open(file_path, 'wb') as f:
        content = await file.read()
        await f.write(content)
    
    return str(file_path)

async def save_character_file(file: UploadFile) -> str:
    """Save character 3D model file"""
    extension = get_file_extension(file.filename)
    if extension not in ALLOWED_MODEL_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_MODEL_EXTENSIONS)}"
        )
    
    return await save_uploaded_file(file, "characters")

async def save_animation_file(file: UploadFile) -> str:
    """Save animation file"""
    extension = get_file_extension(file.filename)
    if extension not in ALLOWED_ANIMATION_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_ANIMATION_EXTENSIONS)}"
        )
    
    return await save_uploaded_file(file, "animations")

async def save_thumbnail_file(file: UploadFile) -> str:
    """Save thumbnail image file"""
    extension = get_file_extension(file.filename)
    if extension not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}"
        )
    
    return await save_uploaded_file(file, "thumbnails")

async def generate_thumbnail_from_model(model_path: str) -> Optional[str]:
    """Generate thumbnail from 3D model (placeholder implementation)"""
    # This is a placeholder - in production you would use a 3D rendering library
    # to generate thumbnails from 3D models
    try:
        # Create a placeholder thumbnail
        img = Image.new('RGB', (300, 300), color='lightgray')
        
        thumbnail_filename = f"thumb_{uuid.uuid4().hex}.jpg"
        thumbnail_path = UPLOAD_DIR / "thumbnails" / thumbnail_filename
        
        img.save(thumbnail_path, "JPEG")
        return str(thumbnail_path)
    except Exception as e:
        print(f"Error generating thumbnail: {e}")
        return None

async def delete_file(file_path: str) -> bool:
    """Delete file from storage"""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        return False
    except Exception as e:
        print(f"Error deleting file {file_path}: {e}")
        return False

def get_file_url(file_path: str) -> str:
    """Convert file path to URL"""
    # In production, this would return a proper URL (CDN, S3, etc.)
    return f"/api/files/{Path(file_path).name}"

def get_file_info(file_path: str) -> dict:
    """Get file information"""
    if not os.path.exists(file_path):
        return {}
    
    stat = os.stat(file_path)
    return {
        "size": stat.st_size,
        "created": stat.st_ctime,
        "modified": stat.st_mtime,
        "path": file_path
    }