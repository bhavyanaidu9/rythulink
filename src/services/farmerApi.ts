import {api} from './api';

export interface CreateProfilePayload {
  name: string;
  village: string;
  mandal: string;
  district: string;
  land_area_acres?: number;
  latitude?: number;
  longitude?: number;
}

export const farmerApi = {
  createProfile: (payload: CreateProfilePayload) =>
    api.post('/api/v1/farmers/profile', payload),

  getMyProfile: () =>
    api.get('/api/v1/farmers/profile/me'),

  updateProfile: (payload: Partial<CreateProfilePayload>) =>
    api.patch('/api/v1/farmers/profile/me', payload),

  uploadPhoto: (formData: FormData) =>
    api.post('/api/v1/farmers/profile/me/photo', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    }),

  getNearbyFarmers: (lat: number, lng: number, radiusKm = 50) =>
    api.get('/api/v1/farmers/nearby/list', {
      params: {latitude: lat, longitude: lng, radius_km: radiusKm},
    }),
};
