# Mixamo Clone - API Contracts & Integration Plan

## Backend API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Characters
- `GET /api/characters` - Get all characters (with pagination, search, filters)
- `GET /api/characters/:id` - Get specific character details
- `POST /api/characters` - Upload new character (3D model file)
- `PUT /api/characters/:id` - Update character metadata
- `DELETE /api/characters/:id` - Delete character
- `POST /api/characters/:id/rig` - Auto-rig uploaded character

### Animations
- `GET /api/animations` - Get all animations (with pagination, search, filters)
- `GET /api/animations/:id` - Get specific animation details
- `POST /api/animations` - Upload new animation
- `PUT /api/animations/:id` - Update animation metadata
- `DELETE /api/animations/:id` - Delete animation

### Character-Animation Processing
- `POST /api/process/apply-animation` - Apply animation to character
- `GET /api/process/status/:jobId` - Get processing job status
- `POST /api/process/download` - Generate and download animated character
- `GET /api/process/preview/:characterId/:animationId` - Get preview URL

### File Management
- `POST /api/upload/character` - Upload 3D character file (FBX, OBJ)
- `POST /api/upload/animation` - Upload animation file
- `GET /api/files/:id` - Download file
- `DELETE /api/files/:id` - Delete file

## Database Models

### User Model
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  avatar: String,
  subscription: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Character Model
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  type: String, // "Humanoid", "Creature", "Robot"
  polygons: Number,
  tags: [String],
  thumbnail: String,
  modelFile: String, // File path/URL
  riggedFile: String, // Auto-rigged version
  isRigged: Boolean,
  uploadedBy: ObjectId,
  isPublic: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Animation Model
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  duration: Number, // in seconds
  tags: [String],
  thumbnail: String,
  animationFile: String,
  previewVideo: String,
  uploadedBy: ObjectId,
  isPublic: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### ProcessingJob Model
```javascript
{
  _id: ObjectId,
  characterId: ObjectId,
  animationId: ObjectId,
  userId: ObjectId,
  status: String, // "pending", "processing", "completed", "failed"
  progress: Number, // 0-100
  resultFile: String,
  error: String,
  settings: {
    speed: Number,
    armSpacing: Number,
    // other animation parameters
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Frontend Mock Data Replacement

### Current Mock Files to Replace:
1. `/src/data/mockData.js` - Replace with actual API calls
2. Character thumbnails - Replace with uploaded file URLs
3. Animation previews - Replace with actual animation thumbnails

### Frontend Integration Points:
1. **CharacterLibrary.jsx** - Replace mock characters with API call to `/api/characters`
2. **AnimationPanel.jsx** - Replace mock animations with API call to `/api/animations`
3. **CharacterViewer.jsx** - Load actual 3D models instead of simple geometry
4. **Upload functionality** - Implement file upload with progress indicators

## File Upload Strategy

### Character Upload Flow:
1. User uploads 3D model file (FBX/OBJ)
2. Backend stores file and creates character record
3. Auto-rigging process starts (background job)
4. Frontend shows upload progress and rigging status
5. Character becomes available once rigged

### Animation Upload Flow:
1. User uploads animation file
2. Backend validates and stores file
3. Thumbnail generation (extract keyframe)
4. Animation becomes available immediately

## Real-Time Features

### WebSocket Integration:
- Processing job status updates
- Real-time collaboration (optional)
- Live preview updates

## Frontend Polish Enhancements

### 3D Improvements:
1. Better character models (using GLTF format)
2. Realistic animations and skeletal systems
3. Advanced lighting and materials
4. Environment backgrounds
5. Character customization options

### UI/UX Enhancements:
1. Drag-and-drop file uploads
2. Real-time search with debouncing
3. Advanced filtering and sorting
4. Animation timeline scrubbing
5. Fullscreen 3D viewer mode
6. Export format options (FBX, GLB, etc.)

## Security & Performance

### Security:
- JWT authentication
- File type validation
- File size limits
- User permissions for uploads/downloads

### Performance:
- File compression for uploads
- CDN integration for static assets
- Lazy loading for 3D models
- Pagination for large datasets
- Caching for frequently accessed data

## Docker Configuration

### Services:
1. **Frontend** - React app with Nginx
2. **Backend** - FastAPI with Python
3. **Database** - MongoDB
4. **File Storage** - MinIO (S3-compatible)
5. **Processing Queue** - Redis + Celery (for background jobs)

This contracts file will guide the seamless integration between frontend and backend components.