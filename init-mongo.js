// MongoDB initialization script
db = db.getSiblingDB('mixamo_clone');

// Create collections with sample data
db.users.insertMany([
  {
    _id: ObjectId(),
    email: 'demo@mixamo.com',
    name: 'Demo User',
    password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeVMgOUTFNr4m7c3i', // password: demo123
    subscription: 'pro',
    avatar: null,
    created_at: new Date(),
    updated_at: new Date()
  }
]);

// Create sample characters
db.characters.insertMany([
  {
    _id: ObjectId(),
    name: 'Kaya',
    description: 'Modern female character with casual attire',
    type: 'Humanoid',
    polygons: 15482,
    tags: ['female', 'casual', 'modern'],
    thumbnail: 'https://images.unsplash.com/photo-1594736797933-d0400c80a2e0?w=300&h=300&fit=crop&crop=face',
    model_file: null,
    rigged_file: null,
    is_rigged: true,
    is_public: true,
    uploaded_by: ObjectId(),
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: ObjectId(),
    name: 'Malcolm',
    description: 'Professional business character',
    type: 'Humanoid',
    polygons: 18672,
    tags: ['male', 'business', 'formal'],
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    model_file: null,
    rigged_file: null,
    is_rigged: true,
    is_public: true,
    uploaded_by: ObjectId(),
    created_at: new Date(),
    updated_at: new Date()
  }
]);

// Create sample animations
db.animations.insertMany([
  {
    _id: ObjectId(),
    name: 'Idle',
    description: 'Basic idle stance',
    category: 'Basic',
    duration: 2.5,
    tags: ['basic', 'loop', 'standing'],
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
    animation_file: null,
    preview_video: null,
    is_public: true,
    uploaded_by: ObjectId(),
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: ObjectId(),
    name: 'Walking',
    description: 'Natural walking cycle',
    category: 'Locomotion',
    duration: 1.2,
    tags: ['locomotion', 'cycle', 'walking'],
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop',
    animation_file: null,
    preview_video: null,
    is_public: true,
    uploaded_by: ObjectId(),
    created_at: new Date(),
    updated_at: new Date()
  }
]);

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.characters.createIndex({ name: "text", description: "text", tags: "text" });
db.animations.createIndex({ name: "text", description: "text", tags: "text" });

print('MongoDB initialization completed successfully!');