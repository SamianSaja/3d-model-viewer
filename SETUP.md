# 3D Model Viewer - Setup Guide

This guide will help you set up and run the 3D Model Viewer application. The project consists of a React frontend, Python FastAPI backend, MongoDB database, and Redis for caching.

## Prerequisites

- Docker and Docker Compose
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

## Project Structure

```
├── frontend/          # React frontend application
├── backend/           # Python FastAPI backend
├── docker-compose.yml # Docker configuration
└── nginx.conf        # Nginx configuration
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/SamianSaja/3d-model-viewer.git
cd 3d-model-viewer
```

### 2. Environment Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: .\venv\Scripts\activate
pip install -r requirements.txt
```

#### Frontend Setup
```bash
cd frontend
npm install   # or yarn install
```

### 3. Start the Application

You can run the application using Docker Compose (recommended) or run each component separately.

#### Using Docker Compose (Recommended)
```bash
docker-compose up --build
```

This will start:
- MongoDB database
- Redis cache
- Backend API server
- Frontend development server
- Nginx reverse proxy

#### Manual Setup (Alternative)

1. Start MongoDB and Redis:
```bash
docker-compose up mongodb redis
```

2. Start the Backend (in a new terminal):
```bash
cd backend
source venv/bin/activate  # On Windows use: .\venv\Scripts\activate
python server.py
```

3. Start the Frontend (in a new terminal):
```bash
cd frontend
npm run start  # or yarn start
```

## Accessing the Application

Once everything is running:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Default Credentials

MongoDB:
- Username: mixamo
- Password: mixamo123
- Database: mixamo_clone

## Additional Information

- The backend API documentation is available at `/docs` endpoint
- The frontend uses modern React with hooks and context for state management
- The application uses Radix UI components for the user interface
- Authentication is implemented using JWT tokens
- File uploads and 3D model processing are handled by the backend

## Troubleshooting

1. If MongoDB fails to start, ensure no other MongoDB instance is running on port 27017
2. If the frontend fails to connect to the backend, check the API URL configuration in `frontend/src/services/apiService.js`
3. For permission issues with Docker, try running the commands with sudo (Linux/macOS)

## Development Notes

- The frontend is built with Create React App and uses Tailwind CSS for styling
- The backend uses FastAPI for high-performance API endpoints
- File processing and animations are handled asynchronously using Celery
- The application supports various 3D model formats and animations

For more detailed information about the API endpoints and available features, please refer to the API documentation at `/docs` endpoint when the backend is running.