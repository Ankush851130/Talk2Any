import { fetchApi } from './api';

export const grammarApi = {
  startSession: (callId) =>
    fetchApi('/grammar/start', {
      method: 'POST',
      body: JSON.stringify({ callId }),
    }),

  sendTranscriptChunk: (callId, text) =>
    fetchApi('/grammar/transcript', {
      method: 'POST',
      body: JSON.stringify({ callId, text }),
    }),

  analyzeGrammar: (callId) =>
    fetchApi('/grammar/analyze', {
      method: 'POST',
      body: JSON.stringify({ callId }),
    }),

  getReport: (callId) => fetchApi(`/grammar/report/${callId}`),

  deleteSession: (callId) =>
    fetchApi(`/grammar/${callId}`, {
      method: 'DELETE',
    }),
};
