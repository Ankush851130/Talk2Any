import { fetchApi } from './api';

export const userApi = {
  getProfile: (identifier) => fetchApi(`/users/${identifier}`),
  updateProfile: (profileData) => fetchApi('/users/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  searchUsers: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return fetchApi(`/users/search${params ? `?${params}` : ''}`);
  },
  getFriends: () => fetchApi('/users/friends'),
  sendFriendRequest: (recipientId) => fetchApi('/users/friend-request', { method: 'POST', body: JSON.stringify({ recipientId }) }),
  respondFriendRequest: (requestId, action) => fetchApi('/users/friend-request/respond', { method: 'POST', body: JSON.stringify({ requestId, action }) }),
  getNotifications: () => fetchApi('/users/notifications'),
  markNotificationsRead: () => fetchApi('/users/notifications/read', { method: 'PUT' }),
};
