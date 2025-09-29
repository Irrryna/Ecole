import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Trainers API
export const getTrainers = () => apiClient.get('/trainers');
export const addTrainer = (trainerData) => apiClient.post('/trainers', trainerData);

// Students API
export const getStudents = () => apiClient.get('/students');
export const addStudent = (studentData) => apiClient.post('/students', studentData);

// Classes API
export const getClasses = () => apiClient.get('/classes');
export const addClass = (classData) => apiClient.post('/classes', classData);
