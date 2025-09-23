import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  // Authentication endpoints
  async login(email, password) {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async register(name, email, password) {
    const response = await this.client.post('/auth/register', { 
      name, 
      email, 
      password,
      subscription: 'free'
    });
    return response.data;
  }

  async getUserProfile() {
    const response = await this.client.get('/auth/profile');
    return response.data;
  }

  async updateProfile(data) {
    const response = await this.client.put('/auth/profile', data);
    return response.data;
  }

  // Character endpoints
  async getCharacters(params = {}) {
    const response = await this.client.get('/characters', { params });
    return response.data;
  }

  async getCharacter(id) {
    const response = await this.client.get(`/characters/${id}`);
    return response.data;
  }

  async uploadCharacter(formData) {
    const response = await this.client.post('/characters', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateCharacter(id, data) {
    const response = await this.client.put(`/characters/${id}`, data);
    return response.data;
  }

  async deleteCharacter(id) {
    const response = await this.client.delete(`/characters/${id}`);
    return response.data;
  }

  // Animation endpoints
  async getAnimations(params = {}) {
    const response = await this.client.get('/animations', { params });
    return response.data;
  }

  async getAnimation(id) {
    const response = await this.client.get(`/animations/${id}`);
    return response.data;
  }

  async uploadAnimation(formData) {
    const response = await this.client.post('/animations', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateAnimation(id, data) {
    const response = await this.client.put(`/animations/${id}`, data);
    return response.data;
  }

  async deleteAnimation(id) {
    const response = await this.client.delete(`/animations/${id}`);
    return response.data;
  }

  // Processing endpoints
  async applyAnimation(characterId, animationId, settings = {}) {
    const response = await this.client.post('/process/apply-animation', {
      character_id: characterId,
      animation_id: animationId,
      settings
    });
    return response.data;
  }

  async getProcessingStatus(jobId) {
    const response = await this.client.get(`/process/status/${jobId}`);
    return response.data;
  }

  async downloadProcessedCharacter(jobId) {
    const response = await this.client.post('/process/download', { job_id: jobId });
    return response.data;
  }

  async getAnimationPreview(characterId, animationId) {
    const response = await this.client.get(`/process/preview/${characterId}/${animationId}`);
    return response.data;
  }

  // File endpoints
  getFileUrl(filename) {
    if (!filename) return null;
    if (filename.startsWith('http')) return filename;
    return `${API}/files/${filename.split('/').pop()}`;
  }

  // Health check
  async healthCheck() {
    const response = await this.client.get('/health');
    return response.data;
  }
}

export const apiService = new ApiService();