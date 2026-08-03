import { fetchApi } from './api';

export const roomApi = {
  getRooms: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return fetchApi(`/rooms${params ? `?${params}` : ''}`);
  },
  getRoomById: (id) => fetchApi(`/rooms/${id}`),
  createRoom: (roomData) => fetchApi('/rooms', { method: 'POST', body: JSON.stringify(roomData) }),
  joinRoomCheck: (id, password = '') => fetchApi(`/rooms/${id}/join-check`, { method: 'POST', body: JSON.stringify({ password }) }),
  deleteRoom: (id) => fetchApi(`/rooms/${id}`, { method: 'DELETE' }),
};
