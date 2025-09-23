from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional
import uuid

class CharacterBase(BaseModel):
    name: str
    description: str = ""
    type: str = "Humanoid"  # "Humanoid", "Creature", "Robot"
    tags: List[str] = []
    is_public: bool = True

class CharacterCreate(CharacterBase):
    pass

class CharacterUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    tags: Optional[List[str]] = None
    is_public: Optional[bool] = None

class CharacterResponse(CharacterBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    polygons: int = 0
    thumbnail: Optional[str] = None
    model_file: Optional[str] = None
    rigged_file: Optional[str] = None
    is_rigged: bool = False
    uploaded_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CharacterList(BaseModel):
    characters: List[CharacterResponse]
    total: int
    page: int
    page_size: int