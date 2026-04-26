import {api} from './api';

export const authApi = {
  sendOTP: (phoneNumber: string) =>
    api.post('/api/v1/auth/send-otp', {phone_number: phoneNumber}),

  verifyOTP: (phoneNumber: string, otpCode: string) =>
    api.post('/api/v1/auth/verify-otp', {
      phone_number: phoneNumber,
      otp_code: otpCode,
      role: 'farmer',
    }),

  refreshToken: (refreshToken: string) =>
    api.post('/api/v1/auth/refresh', {refresh_token: refreshToken}),
};
