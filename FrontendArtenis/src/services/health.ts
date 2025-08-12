import { api } from './api';

export const healthService = {
  async checkHealth() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getApiInfo() {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
