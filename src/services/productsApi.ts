import {api} from './api';

export const productsApi = {
  create: (payload: object) =>
    api.post('/api/v1/products/', payload),

  list: (params?: object) =>
    api.get('/api/v1/products/', {params}),

  get: (productId: string) =>
    api.get(`/api/v1/products/${productId}`),

  update: (productId: string, payload: object) =>
    api.patch(`/api/v1/products/${productId}`, payload),

  uploadImages: (productId: string, formData: FormData) =>
    api.post(`/api/v1/products/${productId}/images`, formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    }),

  delete: (productId: string) =>
    api.delete(`/api/v1/products/${productId}`),
};
