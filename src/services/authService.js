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

  getProfile: async (signal = null) => {
    const response = await api.get('/auth/profile/', { signal });
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.patch('/auth/profile/update/', profileData);
    return response.data;
  },

  uploadProfileImage: async (image, additionalFields = {}) => {
    let formData;
    if (image instanceof FormData) {
      formData = image;
      console.log("[authService] FormData was passed directly.");
    } else {
      formData = new FormData();
      
      // Requirement 8: Ensure FormData is created correctly and append the image file.
      // Do not manually modify the multipart boundary. Explicitly pass filename for iOS compatibility.
      const filename = image.name || 'image.jpg';
      formData.append('image', image, filename);

      // Preserve any existing fields/additional parameters if passed to this service.
      if (additionalFields && typeof additionalFields === 'object') {
        Object.entries(additionalFields).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        });
      }
    }

    // Requirement 9: Verify that the selected File object is actually passed to FormData
    const fileInFormData = formData.get('image');
    console.log("[authService] Verifying File/Blob object in FormData:", fileInFormData);
    if (!fileInFormData) {
      console.error("[authService] Error: 'image' field is missing from FormData!");
    } else if (fileInFormData instanceof File) {
      console.log("[authService] Verification success: 'image' in FormData is a File instance. Name:", fileInFormData.name, "Size:", fileInFormData.size);
    } else if (fileInFormData instanceof Blob) {
      console.log("[authService] Verification info: 'image' in FormData is a Blob instance. Size:", fileInFormData.size);
    } else {
      console.warn("[authService] Warning: 'image' in FormData is not an instance of File or Blob.");
    }

    // Log the full structure of the FormData keys to ensure everything is correct
    console.log("[authService] FormData contents: ");
    for (const [key, val] of formData.entries()) {
      if (val instanceof File) {
        console.log(`  - ${key}: File (name: "${val.name}", size: ${val.size} bytes, type: "${val.type}")`);
      } else {
        console.log(`  - ${key}: "${val}"`);
      }
    }

    // Set Content-Type explicitly to undefined on request config level to let the browser automatically
    // determine boundary for multipart/form-data.
    const response = await api.post('/auth/profile/upload-image/', formData, {
      headers: {
        'Content-Type': undefined
      }
    });
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
  },

  resetPassword: async ({ token, password }) => {
    const response = await api.post(
      '/auth/reset-password/',
      { token, password },
      { skipAuthRedirect: true }
    );
    return response.data;
  }
};

export default authService;
