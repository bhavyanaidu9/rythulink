import api from './api';
import { MMKV } from 'react-native-mmkv';
import NetInfo from '@react-native-community/netinfo';

const storage = new MMKV();

export const createListing = async (formData) => {
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    // Offline support: save draft
    const drafts = JSON.parse(storage.getString('listingDrafts') || '[]');
    // We can't perfectly serialize FormData, so in a real app we'd save local URIs
    // and recreate FormData upon reconnect.
    drafts.push({ id: Date.now(), data: 'mock_serialized_data' });
    storage.set('listingDrafts', JSON.stringify(drafts));
    throw new Error('OFFLINE_DRAFT_SAVED');
  }

  try {
    const response = await api.post('/listings/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMyListings = async (status = 'active', page = 1) => {
  try {
    const response = await api.get('/listings/my-listings', {
      params: { status, page, limit: 20 },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateListing = async (id, updates) => {
  try {
    const response = await api.put(`/listings/${id}`, updates);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteListing = async (id) => {
  try {
    const response = await api.delete(`/listings/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getSuggestedPrice = async (cropName) => {
  try {
    const response = await api.get('/prices/predict', {
      params: { crop_name: cropName, days_ahead: 7 },
    });
    return response.data;
  } catch (error) {
    // Graceful fallback if prediction fails
    return { predicted_price_7days: 0, confidence_interval: [0, 0] };
  }
};
