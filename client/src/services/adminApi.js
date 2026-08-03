import { fetchApi } from './api';

export const adminApi = {
  getStats: () => fetchApi('/admin/stats'),
  getUsers: () => fetchApi('/admin/users'),
  toggleBanUser: (userId, banReason = '') => fetchApi(`/admin/users/${userId}/ban`, { method: 'PUT', body: JSON.stringify({ banReason }) }),
  deleteRoom: (roomId) => fetchApi(`/admin/rooms/${roomId}`, { method: 'DELETE' }),
  getReports: () => fetchApi('/admin/reports'),
  updateReportStatus: (reportId, status) => fetchApi(`/admin/reports/${reportId}`, { method: 'PUT', body: JSON.stringify({ status }) }),
  getLogs: () => fetchApi('/admin/logs'),
};
