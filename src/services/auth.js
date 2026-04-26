import api from './api';

export const sendOTP = async (phoneNumber) => {
  try {
    const response = await api.post('/auth/send-otp', {
      phone_number: phoneNumber,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const verifyOTP = async (phoneNumber, otp, name = null, language_preference = 'te') => {
  try {
    const response = await api.post('/auth/verify-otp', {
      phone_number: phoneNumber,
      otp,
      user_type: 'farmer',
      name,
      language_preference,
    });
    return response.data; // Should return { token, user }
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const fetchProfile = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
