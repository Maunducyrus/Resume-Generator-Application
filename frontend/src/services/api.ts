import axios from 'axios';
import toast from 'react-hot-toast';
import type { User, CV, CVData, ATSResult, JobOptimization, APIResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData: { name: string; email: string; password: string; profession?: string }): Promise<{ user: User; token: string }> => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  login: async (credentials: { email: string; password: string }): Promise<{ user: User; token: string }> => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  getProfile: async (): Promise<User> => {
    try {
      const response = await api.get('/auth/profile');
      return response.data.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    try {
      const response = await api.put('/auth/profile', userData);
      return response.data.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  changePassword: async (passwordData: { currentPassword: string; newPassword: string }): Promise<void> => {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  },
};

// CV API
export const cvAPI = {
  createCV: async (cvData: { name: string; templateId: string; data: CVData; profession?: string }): Promise<CV> => {
    try {
      const response = await api.post('/cv', cvData);
      return response.data.data.cv;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create CV');
    }
  },

  getUserCVs: async (params?: { page?: number; limit?: number; profession?: string }): Promise<{ cvs: CV[]; pagination: any }> => {
    try {
      const response = await api.get('/cv', { params });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get CVs');
    }
  },

  getCVById: async (id: string): Promise<CV> => {
    try {
      const response = await api.get(`/cv/${id}`);
      return response.data.data.cv;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get CV');
    }
  },

  updateCV: async (id: string, updates: Partial<CV>): Promise<CV> => {
    try {
      const response = await api.put(`/cv/${id}`, updates);
      return response.data.data.cv;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update CV');
    }
  },

  deleteCV: async (id: string): Promise<void> => {
    try {
      await api.delete(`/cv/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete CV');
    }
  },

  shareCV: async (id: string, isPublic: boolean): Promise<{ shareUrl?: string; isPublic: boolean }> => {
    try {
      const response = await api.put(`/cv/${id}/share`, { isPublic });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update sharing settings');
    }
  },

  getSharedCV: async (shareUrl: string): Promise<CV> => {
    try {
      const response = await api.get(`/cv/shared/${shareUrl}`);
      return response.data.data.cv;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get shared CV');
    }
  },
};

// AI API
export const aiAPI = {
  generateSummary: async (data: { personalInfo: any; workExperience: any[]; profession: string }): Promise<string> => {
    try {
      const response = await api.post('/ai/generate-summary', data);
      return response.data.data.summary;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate summary');
    }
  },

  optimizeExperience: async (data: { experience: any; profession: string }): Promise<any> => {
    try {
      const response = await api.post('/ai/optimize-experience', data);
      return response.data.data.experience;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to optimize experience');
    }
  },

  generateCoverLetter: async (data: { cvData: CVData; jobDescription: string; profession: string }): Promise<string> => {
    try {
      const response = await api.post('/ai/generate-cover-letter', data);
      return response.data.data.coverLetter;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate cover letter');
    }
  },

  generateInterviewQuestions: async (data: { profession: string; jobDescription?: string; experienceLevel?: string }): Promise<string[]> => {
    try {
      const response = await api.post('/ai/generate-interview-questions', data);
      return response.data.data.questions;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate interview questions');
    }
  },

  calculateATSScore: async (data: { cvData: CVData; profession: string }): Promise<ATSResult> => {
    try {
      const response = await api.post('/ai/calculate-ats-score', data);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to calculate ATS score');
    }
  },

  optimizeForJob: async (data: { cvData: CVData; jobDescription: string; profession: string }): Promise<JobOptimization> => {
    try {
      const response = await api.post('/ai/optimize-for-job', data);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to optimize for job');
    }
  },

  generateSkillSuggestions: async (data: { profession: string; experience?: any[] }): Promise<string[]> => {
    try {
      const response = await api.post('/ai/generate-skill-suggestions', data);
      return response.data.data.skills;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate skill suggestions');
    }
  },
};

export default api;