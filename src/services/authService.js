import api, { isMockActive } from './api';

export const authService = {
  login: async (email, password) => {
    if (isMockActive) {
      await new Promise(resolve => setTimeout(resolve, 600));
      // Handled primarily in AuthContext.jsx, but returns mock payload
      return { token: 'mock-token-99999', user: { id: 'u-user', name: 'John Doe', email, role: 'user' } };
    }
    const response = await api.post('/auth/login/', { email, password });
    return response.data;
  },
  
  register: async (userData) => {
    if (isMockActive) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { token: 'mock-token-99999', user: { id: 'u-user', ...userData } };
    }
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },

  getProfile: async () => {
    if (isMockActive) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return JSON.parse(localStorage.getItem('user'));
    }
    const response = await api.get('/auth/profile/');
    return response.data;
  }
};

export default authService;
