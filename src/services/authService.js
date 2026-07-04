import api from './api';

export const authService = {
  login: async (phone, password) => {
    const response = await api.post(
      '/auth/login/',
      { phone, password },
      { skipAuthRedirect: true }
    );
    if (response.data?.error || !response.data?.token) {
      const loginError = new Error(response.data?.error || 'Invalid credentials');
      loginError.response = response;
      throw loginError;
    }
    return response.data; // returns { token, user_id, name, phone, role }
  },
  
  register: async (userData) => {
    // Backend RegisterSerializer expects: name, phone, password, token.
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
  },

  updateProfile: async (profileData) => {
    const response = await api.patch('/auth/profile/update/', profileData);
    return response.data;
  },

  uploadProfileImage: async (image) => {
    const formData = new FormData();
    formData.append('image', image);
    const response = await api.post('/auth/profile/upload-image/', formData);
    return response.data;
  },

  checkForgotPasswordPhone: async (phone) => {
    const response = await api.post(
      '/auth/forgot-password/check-phone/',
      { phone },
      { skipAuthRedirect: true }
    );
    return response.data;
  },

  resetPasswordWithFirebase: async ({ phone, firebase_id_token, password }) => {
    const response = await api.post(
      '/auth/firebase-reset-password/',
      { phone, firebase_id_token, password },
      { skipAuthRedirect: true }
    );
    return response.data;
  },

  requestPasswordReset: async (phone) => {
    const response = await api.post(
      '/auth/request-password-reset/',
      { phone },
      { skipAuthRedirect: true }
    );
    return response.data;
  }
};

export default authService;
