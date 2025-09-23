from fastapi import APIRouter, HTTPException, status, Depends
from typing import Optional
from database import processing_jobs_collection, characters_collection, animations_collection
from models.processing import ProcessingJobResponse, ApplyAnimationRequest, ProcessingJobUpdate
from auth import get_current_user
from datetime import datetime
from bson import ObjectId
import uuid

router = APIRouter(prefix="/process", tags=["processing"])

@router.post("/apply-animation", response_model=ProcessingJobResponse)
async def apply_animation_to_character(
    request: ApplyAnimationRequest,
    current_user: dict = Depends(get_current_user)
):
    """Apply animation to character and start processing job"""
    user_id = current_user.get("sub")
    
    # Verify character exists and is accessible
    character = await characters_collection.find_one({
        "_id": ObjectId(request.character_id),
        "$or": [
            {"is_public": True},
            {"uploaded_by": ObjectId(user_id)}
        ]
    })
    
    if not character:
        raise HTTPException(status_code=404, detail="Character not found or not accessible")
    
    # Verify animation exists and is accessible
    animation = await animations_collection.find_one({
        "_id": ObjectId(request.animation_id),
        "$or": [
            {"is_public": True},
            {"uploaded_by": ObjectId(user_id)}
        ]
    })
    
    if not animation:
        raise HTTPException(status_code=404, detail="Animation not found or not accessible")
    
    # Create processing job
    job_doc = {
        "_id": ObjectId(),
        "character_id": ObjectId(request.character_id),
        "animation_id": ObjectId(request.animation_id),
        "user_id": ObjectId(user_id),
        "status": "pending",
        "progress": 0,
        "result_file": None,
        "error": None,
        "settings": request.settings,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insert job
    result = await processing_jobs_collection.insert_one(job_doc)
    
    # TODO: Queue the job for background processing
    # In a real implementation, this would trigger a Celery task or similar
    # For now, we'll simulate immediate processing
    await simulate_processing(str(result.inserted_id))
    
    return ProcessingJobResponse(
        id=str(result.inserted_id),
        character_id=request.character_id,
        animation_id=request.animation_id,
        user_id=user_id,
        status="pending",
        progress=0,
        settings=request.settings,
        created_at=job_doc["created_at"],
        updated_at=job_doc["updated_at"]
    )

@router.get("/status/{job_id}", response_model=ProcessingJobResponse)
async def get_processing_status(
    job_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get processing job status"""
    user_id = current_user.get("sub")
    
    try:
        job = await processing_jobs_collection.find_one({
            "_id": ObjectId(job_id),
            "user_id": ObjectId(user_id)
        })
        
        if not job:
            raise HTTPException(status_code=404, detail="Job not found or access denied")
        
        return ProcessingJobResponse(
            id=str(job["_id"]),
            character_id=str(job["character_id"]),
            animation_id=str(job["animation_id"]),
            user_id=str(job["user_id"]),
            status=job["status"],
            progress=job["progress"],
            result_file=job.get("result_file"),
            error=job.get("error"),
            settings=job.get("settings", {}),
            created_at=job["created_at"],
            updated_at=job["updated_at"]
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid job ID")

@router.post("/download")
async def download_processed_character(
    job_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Generate download link for processed character"""
    user_id = current_user.get("sub")
    
    try:
        job = await processing_jobs_collection.find_one({
            "_id": ObjectId(job_id),
            "user_id": ObjectId(user_id),
            "status": "completed"
        })
        
        if not job:
            raise HTTPException(
                status_code=404, 
                detail="Job not found, access denied, or not completed"
            )
        
        if not job.get("result_file"):
            raise HTTPException(status_code=404, detail="No result file available")
        
        # In a real implementation, this would generate a signed download URL
        download_url = f"/api/files/download/{job_id}"
        
        return {
            "download_url": download_url,
            "filename": f"character_animated_{job_id}.fbx",
            "expires_in": 3600  # 1 hour
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid job ID")

@router.get("/preview/{character_id}/{animation_id}")
async def get_animation_preview(
    character_id: str,
    animation_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get preview of character with animation applied"""
    
    # Verify character and animation exist
    character = await characters_collection.find_one({
        "_id": ObjectId(character_id),
        "$or": [
            {"is_public": True},
            {"uploaded_by": ObjectId(current_user.get("sub"))}
        ]
    })
    
    animation = await animations_collection.find_one({
        "_id": ObjectId(animation_id),
        "$or": [
            {"is_public": True},
            {"uploaded_by": ObjectId(current_user.get("sub"))}
        ]
    })
    
    if not character or not animation:
        raise HTTPException(status_code=404, detail="Character or animation not found")
    
    # Generate preview (in real implementation, this would be a 3D preview)
    preview_data = {
        "character": {
            "id": character_id,
            "name": character["name"],
            "model_url": f"/api/files/{character.get('model_file', '')}"
        },
        "animation": {
            "id": animation_id,
            "name": animation["name"],
            "duration": animation.get("duration", 0.0),
            "animation_url": f"/api/files/{animation.get('animation_file', '')}"
        },
        "preview_url": f"/api/preview/{character_id}_{animation_id}.mp4"
    }
    
    return preview_data

# Helper function to simulate processing
async def simulate_processing(job_id: str):
    """Simulate background processing (replace with real Celery task)"""
    import asyncio
    
    # Update job status to processing
    await processing_jobs_collection.update_one(
        {"_id": ObjectId(job_id)},
        {
            "$set": {
                "status": "processing",
                "progress": 10,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    # Simulate processing time
    await asyncio.sleep(2)
    
    # Update progress
    await processing_jobs_collection.update_one(
        {"_id": ObjectId(job_id)},
        {
            "$set": {
                "progress": 50,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    await asyncio.sleep(2)
    
    # Complete the job
    await processing_jobs_collection.update_one(
        {"_id": ObjectId(job_id)},
        {
            "$set": {
                "status": "completed",
                "progress": 100,
                "result_file": f"processed/character_animated_{job_id}.fbx",
                "updated_at": datetime.utcnow()
            }
        }
    )