from fastapi import APIRouter, HTTPException, status, Depends, File, UploadFile, Query, Form
from typing import Optional, List
from database import characters_collection
from models.character import CharacterCreate, CharacterResponse, CharacterUpdate, CharacterList
from auth import get_current_user
from file_handler import save_character_file, save_thumbnail_file, generate_thumbnail_from_model, get_file_url
from datetime import datetime
from bson import ObjectId
import uuid

router = APIRouter(prefix="/characters", tags=["characters"])

@router.get("", response_model=CharacterList)
async def get_characters(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    type_filter: Optional[str] = Query(None),
    tags: Optional[List[str]] = Query(None),
    current_user: dict = Depends(get_current_user)
):
    """Get characters with pagination and filtering"""
    
    # Build query
    query = {"is_public": True}
    
    if search:
        query["$text"] = {"$search": search}
    
    if type_filter:
        query["type"] = type_filter
    
    if tags:
        query["tags"] = {"$in": tags}
    
    # Get total count
    total = await characters_collection.count_documents(query)
    
    # Get characters with pagination
    skip = (page - 1) * page_size
    cursor = characters_collection.find(query).skip(skip).limit(page_size).sort("created_at", -1)
    
    characters = []
    async for char in cursor:
        characters.append(CharacterResponse(
            id=str(char["_id"]),
            name=char["name"],
            description=char.get("description", ""),
            type=char.get("type", "Humanoid"),
            polygons=char.get("polygons", 0),
            tags=char.get("tags", []),
            thumbnail=get_file_url(char.get("thumbnail", "")),
            model_file=get_file_url(char.get("model_file", "")),
            rigged_file=get_file_url(char.get("rigged_file", "")),
            is_rigged=char.get("is_rigged", False),
            is_public=char.get("is_public", True),
            uploaded_by=str(char["uploaded_by"]),
            created_at=char["created_at"],
            updated_at=char["updated_at"]
        ))
    
    return CharacterList(
        characters=characters,
        total=total,
        page=page,
        page_size=page_size
    )

@router.get("/{character_id}", response_model=CharacterResponse)
async def get_character(
    character_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get specific character"""
    try:
        char = await characters_collection.find_one({"_id": ObjectId(character_id)})
        if not char:
            raise HTTPException(status_code=404, detail="Character not found")
        
        return CharacterResponse(
            id=str(char["_id"]),
            name=char["name"],
            description=char.get("description", ""),
            type=char.get("type", "Humanoid"),
            polygons=char.get("polygons", 0),
            tags=char.get("tags", []),
            thumbnail=get_file_url(char.get("thumbnail", "")),
            model_file=get_file_url(char.get("model_file", "")),
            rigged_file=get_file_url(char.get("rigged_file", "")),
            is_rigged=char.get("is_rigged", False),
            is_public=char.get("is_public", True),
            uploaded_by=str(char["uploaded_by"]),
            created_at=char["created_at"],
            updated_at=char["updated_at"]
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid character ID")

@router.post("", response_model=CharacterResponse)
async def upload_character(
    name: str = Form(...),
    description: str = Form(""),
    type: str = Form("Humanoid"),
    tags: str = Form(""),
    is_public: bool = Form(True),
    model_file: UploadFile = File(...),
    thumbnail: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_user)
):
    """Upload new character"""
    user_id = current_user.get("sub")
    
    # Save model file
    model_path = await save_character_file(model_file)
    
    # Save or generate thumbnail
    thumbnail_path = None
    if thumbnail:
        thumbnail_path = await save_thumbnail_file(thumbnail)
    else:
        thumbnail_path = await generate_thumbnail_from_model(model_path)
    
    # Parse tags
    tag_list = [tag.strip() for tag in tags.split(",") if tag.strip()] if tags else []
    
    # Create character document
    character_id = str(uuid.uuid4())
    character_doc = {
        "_id": ObjectId(),
        "name": name,
        "description": description,
        "type": type,
        "polygons": 0,  # TODO: Calculate from model file
        "tags": tag_list,
        "thumbnail": thumbnail_path,
        "model_file": model_path,
        "rigged_file": None,
        "is_rigged": False,
        "is_public": is_public,
        "uploaded_by": ObjectId(user_id),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insert character
    result = await characters_collection.insert_one(character_doc)
    
    return CharacterResponse(
        id=str(result.inserted_id),
        name=name,
        description=description,
        type=type,
        polygons=0,
        tags=tag_list,
        thumbnail=get_file_url(thumbnail_path) if thumbnail_path else None,
        model_file=get_file_url(model_path),
        is_rigged=False,
        is_public=is_public,
        uploaded_by=user_id,
        created_at=character_doc["created_at"],
        updated_at=character_doc["updated_at"]
    )

@router.put("/{character_id}", response_model=CharacterResponse)
async def update_character(
    character_id: str,
    character_update: CharacterUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update character metadata"""
    user_id = current_user.get("sub")
    
    # Check if character exists and user owns it
    char = await characters_collection.find_one({
        "_id": ObjectId(character_id),
        "uploaded_by": ObjectId(user_id)
    })
    
    if not char:
        raise HTTPException(status_code=404, detail="Character not found or access denied")
    
    # Prepare update data
    update_data = {"updated_at": datetime.utcnow()}
    
    if character_update.name is not None:
        update_data["name"] = character_update.name
    if character_update.description is not None:
        update_data["description"] = character_update.description
    if character_update.type is not None:
        update_data["type"] = character_update.type
    if character_update.tags is not None:
        update_data["tags"] = character_update.tags
    if character_update.is_public is not None:
        update_data["is_public"] = character_update.is_public
    
    # Update character
    await characters_collection.update_one(
        {"_id": ObjectId(character_id)},
        {"$set": update_data}
    )
    
    # Get updated character
    updated_char = await characters_collection.find_one({"_id": ObjectId(character_id)})
    
    return CharacterResponse(
        id=str(updated_char["_id"]),
        name=updated_char["name"],
        description=updated_char.get("description", ""),
        type=updated_char.get("type", "Humanoid"),
        polygons=updated_char.get("polygons", 0),
        tags=updated_char.get("tags", []),
        thumbnail=get_file_url(updated_char.get("thumbnail", "")),
        model_file=get_file_url(updated_char.get("model_file", "")),
        rigged_file=get_file_url(updated_char.get("rigged_file", "")),
        is_rigged=updated_char.get("is_rigged", False),
        is_public=updated_char.get("is_public", True),
        uploaded_by=str(updated_char["uploaded_by"]),
        created_at=updated_char["created_at"],
        updated_at=updated_char["updated_at"]
    )

@router.delete("/{character_id}")
async def delete_character(
    character_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete character"""
    user_id = current_user.get("sub")
    
    # Check if character exists and user owns it
    char = await characters_collection.find_one({
        "_id": ObjectId(character_id),
        "uploaded_by": ObjectId(user_id)
    })
    
    if not char:
        raise HTTPException(status_code=404, detail="Character not found or access denied")
    
    # TODO: Delete associated files
    # delete_file(char.get("model_file"))
    # delete_file(char.get("thumbnail"))
    # delete_file(char.get("rigged_file"))
    
    # Delete character
    await characters_collection.delete_one({"_id": ObjectId(character_id)})
    
    return {"message": "Character deleted successfully"}