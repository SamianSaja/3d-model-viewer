from fastapi import APIRouter, HTTPException, status, Depends, File, UploadFile, Query, Form
from typing import Optional, List
from database import animations_collection
from models.animation import AnimationCreate, AnimationResponse, AnimationUpdate, AnimationList
from auth import get_current_user
from file_handler import save_animation_file, save_thumbnail_file, get_file_url
from datetime import datetime
from bson import ObjectId
import uuid

router = APIRouter(prefix="/animations", tags=["animations"])

@router.get("", response_model=AnimationList)
async def get_animations(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    tags: Optional[List[str]] = Query(None),
    current_user: dict = Depends(get_current_user)
):
    """Get animations with pagination and filtering"""
    
    # Build query
    query = {"is_public": True}
    
    if search:
        query["$text"] = {"$search": search}
    
    if category:
        query["category"] = category
    
    if tags:
        query["tags"] = {"$in": tags}
    
    # Get total count
    total = await animations_collection.count_documents(query)
    
    # Get animations with pagination
    skip = (page - 1) * page_size
    cursor = animations_collection.find(query).skip(skip).limit(page_size).sort("created_at", -1)
    
    animations = []
    async for anim in cursor:
        animations.append(AnimationResponse(
            id=str(anim["_id"]),
            name=anim["name"],
            description=anim.get("description", ""),
            category=anim.get("category", "Basic"),
            duration=anim.get("duration", 0.0),
            tags=anim.get("tags", []),
            thumbnail=get_file_url(anim.get("thumbnail", "")),
            animation_file=get_file_url(anim.get("animation_file", "")),
            preview_video=get_file_url(anim.get("preview_video", "")),
            is_public=anim.get("is_public", True),
            uploaded_by=str(anim["uploaded_by"]),
            created_at=anim["created_at"],
            updated_at=anim["updated_at"]
        ))
    
    return AnimationList(
        animations=animations,
        total=total,
        page=page,
        page_size=page_size
    )

@router.get("/{animation_id}", response_model=AnimationResponse)
async def get_animation(
    animation_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get specific animation"""
    try:
        anim = await animations_collection.find_one({"_id": ObjectId(animation_id)})
        if not anim:
            raise HTTPException(status_code=404, detail="Animation not found")
        
        return AnimationResponse(
            id=str(anim["_id"]),
            name=anim["name"],
            description=anim.get("description", ""),
            category=anim.get("category", "Basic"),
            duration=anim.get("duration", 0.0),
            tags=anim.get("tags", []),
            thumbnail=get_file_url(anim.get("thumbnail", "")),
            animation_file=get_file_url(anim.get("animation_file", "")),
            preview_video=get_file_url(anim.get("preview_video", "")),
            is_public=anim.get("is_public", True),
            uploaded_by=str(anim["uploaded_by"]),
            created_at=anim["created_at"],
            updated_at=anim["updated_at"]
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid animation ID")

@router.post("", response_model=AnimationResponse)
async def upload_animation(
    name: str = Form(...),
    description: str = Form(""),
    category: str = Form("Basic"),
    duration: float = Form(0.0),
    tags: str = Form(""),
    is_public: bool = Form(True),
    animation_file: UploadFile = File(...),
    thumbnail: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_user)
):
    """Upload new animation"""
    user_id = current_user.get("sub")
    
    # Save animation file
    animation_path = await save_animation_file(animation_file)
    
    # Save thumbnail if provided
    thumbnail_path = None
    if thumbnail:
        thumbnail_path = await save_thumbnail_file(thumbnail)
    
    # Parse tags
    tag_list = [tag.strip() for tag in tags.split(",") if tag.strip()] if tags else []
    
    # Create animation document
    animation_doc = {
        "_id": ObjectId(),
        "name": name,
        "description": description,
        "category": category,
        "duration": duration,
        "tags": tag_list,
        "thumbnail": thumbnail_path,
        "animation_file": animation_path,
        "preview_video": None,
        "is_public": is_public,
        "uploaded_by": ObjectId(user_id),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insert animation
    result = await animations_collection.insert_one(animation_doc)
    
    return AnimationResponse(
        id=str(result.inserted_id),
        name=name,
        description=description,
        category=category,
        duration=duration,
        tags=tag_list,
        thumbnail=get_file_url(thumbnail_path) if thumbnail_path else None,
        animation_file=get_file_url(animation_path),
        is_public=is_public,
        uploaded_by=user_id,
        created_at=animation_doc["created_at"],
        updated_at=animation_doc["updated_at"]
    )

@router.put("/{animation_id}", response_model=AnimationResponse)
async def update_animation(
    animation_id: str,
    animation_update: AnimationUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update animation metadata"""
    user_id = current_user.get("sub")
    
    # Check if animation exists and user owns it
    anim = await animations_collection.find_one({
        "_id": ObjectId(animation_id),
        "uploaded_by": ObjectId(user_id)
    })
    
    if not anim:
        raise HTTPException(status_code=404, detail="Animation not found or access denied")
    
    # Prepare update data
    update_data = {"updated_at": datetime.utcnow()}
    
    if animation_update.name is not None:
        update_data["name"] = animation_update.name
    if animation_update.description is not None:
        update_data["description"] = animation_update.description
    if animation_update.category is not None:
        update_data["category"] = animation_update.category
    if animation_update.tags is not None:
        update_data["tags"] = animation_update.tags
    if animation_update.is_public is not None:
        update_data["is_public"] = animation_update.is_public
    
    # Update animation
    await animations_collection.update_one(
        {"_id": ObjectId(animation_id)},
        {"$set": update_data}
    )
    
    # Get updated animation
    updated_anim = await animations_collection.find_one({"_id": ObjectId(animation_id)})
    
    return AnimationResponse(
        id=str(updated_anim["_id"]),
        name=updated_anim["name"],
        description=updated_anim.get("description", ""),
        category=updated_anim.get("category", "Basic"),
        duration=updated_anim.get("duration", 0.0),
        tags=updated_anim.get("tags", []),
        thumbnail=get_file_url(updated_anim.get("thumbnail", "")),
        animation_file=get_file_url(updated_anim.get("animation_file", "")),
        preview_video=get_file_url(updated_anim.get("preview_video", "")),
        is_public=updated_anim.get("is_public", True),
        uploaded_by=str(updated_anim["uploaded_by"]),
        created_at=updated_anim["created_at"],
        updated_at=updated_anim["updated_at"]
    )

@router.delete("/{animation_id}")
async def delete_animation(
    animation_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete animation"""
    user_id = current_user.get("sub")
    
    # Check if animation exists and user owns it
    anim = await animations_collection.find_one({
        "_id": ObjectId(animation_id),
        "uploaded_by": ObjectId(user_id)
    })
    
    if not anim:
        raise HTTPException(status_code=404, detail="Animation not found or access denied")
    
    # TODO: Delete associated files
    # delete_file(anim.get("animation_file"))
    # delete_file(anim.get("thumbnail"))
    # delete_file(anim.get("preview_video"))
    
    # Delete animation
    await animations_collection.delete_one({"_id": ObjectId(animation_id)})
    
    return {"message": "Animation deleted successfully"}