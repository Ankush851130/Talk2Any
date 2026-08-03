import { fetchApi } from './api';

export const reportApi = {
  submitReport: (reportData) => fetchApi('/reports', { method: 'POST', body: JSON.stringify(reportData) }),
};
