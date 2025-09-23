from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPAuthorizationCredentials
from database import users_collection
from models.user import UserCreate, UserLogin, UserResponse, Token, UserUpdate
from auth import get_password_hash, verify_password, create_access_token, get_current_user
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=Token)
async def register_user(user: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and create user
    hashed_password = get_password_hash(user.password)
    user_dict = {
        "email": user.email,
        "name": user.name,
        "password": hashed_password,
        "subscription": user.subscription,
        "avatar": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insert user
    result = await users_collection.insert_one(user_dict)
    user_dict["_id"] = result.inserted_id
    
    # Create access token
    access_token = create_access_token(data={"sub": str(result.inserted_id)})
    
    # Return user response
    user_response = UserResponse(
        id=str(result.inserted_id),
        email=user.email,
        name=user.name,
        subscription=user.subscription,
        created_at=user_dict["created_at"],
        updated_at=user_dict["updated_at"]
    )
    
    return Token(access_token=access_token, user=user_response)

@router.post("/login", response_model=Token)
async def login_user(user: UserLogin):
    """Login user"""
    # Find user by email
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(db_user["_id"])})
    
    # Return user response
    user_response = UserResponse(
        id=str(db_user["_id"]),
        email=db_user["email"],
        name=db_user["name"],
        subscription=db_user.get("subscription", "free"),
        avatar=db_user.get("avatar"),
        created_at=db_user["created_at"],
        updated_at=db_user["updated_at"]
    )
    
    return Token(access_token=access_token, user=user_response)

@router.get("/profile", response_model=UserResponse)
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    from bson import ObjectId
    
    user_id = current_user.get("sub")
    db_user = await users_collection.find_one({"_id": ObjectId(user_id)})
    
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=str(db_user["_id"]),
        email=db_user["email"],
        name=db_user["name"],
        subscription=db_user.get("subscription", "free"),
        avatar=db_user.get("avatar"),
        created_at=db_user["created_at"],
        updated_at=db_user["updated_at"]
    )

@router.put("/profile", response_model=UserResponse)
async def update_user_profile(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update user profile"""
    from bson import ObjectId
    
    user_id = current_user.get("sub")
    
    # Prepare update data
    update_data = {}
    if user_update.name is not None:
        update_data["name"] = user_update.name
    if user_update.subscription is not None:
        update_data["subscription"] = user_update.subscription
    
    update_data["updated_at"] = datetime.utcnow()
    
    # Update user
    result = await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get updated user
    db_user = await users_collection.find_one({"_id": ObjectId(user_id)})
    
    return UserResponse(
        id=str(db_user["_id"]),
        email=db_user["email"],
        name=db_user["name"],
        subscription=db_user.get("subscription", "free"),
        avatar=db_user.get("avatar"),
        created_at=db_user["created_at"],
        updated_at=db_user["updated_at"]
    )