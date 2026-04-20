import axios from 'axios';
import type { IntelligenceRecord, DashboardStats } from '../types';

const API_URL = 'http://localhost:5001/api/intelligence';

export const api = {
  getRecords: async (filters: { sourceType?: string; priority?: string; search?: string } = {}) => {
    const response = await axios.get<{ success: boolean; data: IntelligenceRecord[] }>(API_URL, { params: filters });
    return response.data.data;
  },

  getStats: async () => {
    const response = await axios.get<{ success: boolean; stats: DashboardStats; recent: IntelligenceRecord[] }>(`${API_URL}/stats`);
    return response.data;
  },

  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post<{ success: boolean; count: number; data: IntelligenceRecord[] }>(`${API_URL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await axios.post<{ success: boolean; imageUrl: string }>(`${API_URL}/upload-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  createRecord: async (record: Partial<IntelligenceRecord>) => {
    const response = await axios.post<{ success: boolean; data: IntelligenceRecord }>(API_URL, record);
    return response.data.data;
  },
};
