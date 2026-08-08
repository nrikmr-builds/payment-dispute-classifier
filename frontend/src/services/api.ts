import axios from 'axios';
import { ClassificationResponse, DisputeRequest, HumanReviewRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add user ID header
api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId') || 'demo-user';
  config.headers['X-User-Id'] = userId;
  return config;
});

export const disputeApi = {
  /**
   * Submit a dispute for classification
   */
  classifyDispute: async (request: DisputeRequest): Promise<ClassificationResponse> => {
    const response = await api.post('/disputes/classify', request);
    return response.data;
  },

  /**
   * Submit human review for a low-confidence classification
   */
  submitHumanReview: async (
    disputeId: string,
    request: HumanReviewRequest
  ): Promise<ClassificationResponse> => {
    const response = await api.post(`/disputes/${disputeId}/review`, request);
    return response.data;
  },
};

export default api;