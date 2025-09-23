from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Dict, Any
import uuid

class ProcessingJobBase(BaseModel):
    character_id: str
    animation_id: str
    settings: Dict[str, Any] = {}

class ProcessingJobCreate(ProcessingJobBase):
    pass

class ProcessingJobUpdate(BaseModel):
    status: Optional[str] = None
    progress: Optional[int] = None
    result_file: Optional[str] = None
    error: Optional[str] = None

class ProcessingJobResponse(ProcessingJobBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    status: str = "pending"  # "pending", "processing", "completed", "failed"
    progress: int = 0  # 0-100
    result_file: Optional[str] = None
    error: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ApplyAnimationRequest(BaseModel):
    character_id: str
    animation_id: str
    settings: Dict[str, Any] = {
        "speed": 1.0,
        "arm_spacing": 50,
        "export_format": "fbx"
    }