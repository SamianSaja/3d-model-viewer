from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional
import uuid

class AnimationBase(BaseModel):
    name: str
    description: str = ""
    category: str = "Basic"
    tags: List[str] = []
    is_public: bool = True

class AnimationCreate(AnimationBase):
    pass

class AnimationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    is_public: Optional[bool] = None

class AnimationResponse(AnimationBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    duration: float = 0.0  # in seconds
    thumbnail: Optional[str] = None
    animation_file: Optional[str] = None
    preview_video: Optional[str] = None
    uploaded_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class AnimationList(BaseModel):
    animations: List[AnimationResponse]
    total: int
    page: int
    page_size: int