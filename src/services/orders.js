import api from './api';

export const getMyOrders = async (status, page = 1) => {
  try {
    const response = await api.get('/orders/my-orders', {
      params: { status, page, limit: 20 },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const acceptOrder = async (orderId) => {
  try {
    const response = await api.put(`/orders/${orderId}/accept`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const rejectOrder = async (orderId, reason) => {
  try {
    const response = await api.put(`/orders/${orderId}/reject`, { rejection_reason: reason });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    // We created specific endpoints in backend:
    // /mark-in-transit, /mark-delivered
    if (newStatus === 'IN_TRANSIT') {
      const response = await api.put(`/orders/${orderId}/mark-in-transit`);
      return response.data;
    } else if (newStatus === 'DELIVERED') {
      const response = await api.put(`/orders/${orderId}/mark-delivered`);
      return response.data;
    }
  } catch (error) {
    throw error.response?.data || error;
  }
};
