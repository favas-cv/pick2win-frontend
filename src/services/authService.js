import api from './api';

export const authService = {
  login: async (phone, password) => {
    const response = await api.post('/auth/login/', { phone, password });
    return response.data; // returns { token, user_id, name, phone, role }
  },
  
  register: async (userData) => {
    // userData must have: name, phone, password1, password2, token (invite token)
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },

  registerClubOwner: async (clubOwnerData) => {
    // clubOwnerData: name, phone, password, password2, club_name, slug, place, description
    const response = await api.post('/auth/club-register/', clubOwnerData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    return response.data;
  }
};

export default authService;
