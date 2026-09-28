/**
 * Speech-to-Text Service Abstraction
 * Handles speech recognition options and provider configuration.
 */

const getProviderConfig = () => {
  return {
    provider: process.env.SPEECH_TO_TEXT_PROVIDER || 'browser_web_speech',
    apiKeyConfigured: !!process.env.SPEECH_TO_TEXT_API_KEY,
  };
};

/**
 * Validates and sanitizes incoming transcript chunks
 */
const sanitizeTranscriptChunk = (text) => {
  if (typeof text !== 'string') return '';
  return text.trim().replace(/\s+/g, ' ');
};

module.exports = {
  getProviderConfig,
  sanitizeTranscriptChunk,
};
