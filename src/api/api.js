import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const markTaskComplete = async (taskId) => {
  const response = await api.patch(`/tasks/${taskId}/complete`);
  return response.data;
};

// Correct: PUT /projects/:id with { status: 'Completed' }
export const markProjectComplete = async (projectId) => {
  try {
    const response = await api.put(`/projects/${projectId}`, { status: 'Completed' });
    return response.data;
  } catch (error) {
    console.error('Error marking project complete:', error);
    throw error;
  }
};

export default api;
