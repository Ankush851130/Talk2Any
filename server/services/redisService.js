const Redis = require('ioredis');

const DEFAULT_REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const TTL_SECONDS = 3600; // 1 Hour TTL

let redisClient = null;
let isRedisConnected = false;

// Fallback in-memory store if Redis server is unreachable (for robust dev fallback)
const inMemoryStore = new Map();

try {
  redisClient = new Redis(DEFAULT_REDIS_URL, {
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => {
      if (times > 3) {
        console.warn('[RedisService] Redis connection limit reached. Using in-memory fallback.');
        return null; // Stop retrying and fallback gracefully
      }
      return Math.min(times * 200, 1000);
    },
    lazyConnect: true,
  });

  redisClient.on('connect', () => {
    isRedisConnected = true;
    console.log('[RedisService] Connected to Redis successfully');
  });

  redisClient.on('error', (err) => {
    isRedisConnected = false;
    console.warn('[RedisService] Redis connection warning:', err.message);
  });

  // Attempt initial lazy connection asynchronously
  redisClient.connect().catch((err) => {
    isRedisConnected = false;
    console.warn('[RedisService] Redis unavailable on startup. Active in-memory fallback mode:', err.message);
  });
} catch (err) {
  console.warn('[RedisService] Error initializing Redis client:', err.message);
}

/**
 * Format Redis key for call temporary data
 */
const getTranscriptKey = (callId, userId) => `call:${callId}:${userId}:transcript`;
const getGrammarKey = (callId, userId) => `call:${callId}:${userId}:grammar`;

/**
 * Start a new temporary transcript session
 */
const startSession = async (callId, userId) => {
  const transcriptKey = getTranscriptKey(callId, userId);
  const grammarKey = getGrammarKey(callId, userId);

  if (isRedisConnected && redisClient) {
    try {
      await redisClient.del(transcriptKey, grammarKey);
      await redisClient.expire(transcriptKey, TTL_SECONDS);
      return true;
    } catch (err) {
      console.warn('[RedisService] Error in startSession:', err.message);
    }
  }

  // Fallback in-memory
  inMemoryStore.set(transcriptKey, { chunks: [], expiresAt: Date.now() + TTL_SECONDS * 1000 });
  inMemoryStore.set(grammarKey, { data: null, expiresAt: Date.now() + TTL_SECONDS * 1000 });
  return true;
};

/**
 * Append a recognized speech chunk to temporary transcript
 */
const appendTranscript = async (callId, userId, text) => {
  if (!text || !text.trim()) return false;
  const cleanText = text.trim();
  const transcriptKey = getTranscriptKey(callId, userId);

  if (isRedisConnected && redisClient) {
    try {
      await redisClient.rpush(transcriptKey, cleanText);
      await redisClient.expire(transcriptKey, TTL_SECONDS);
      return true;
    } catch (err) {
      console.warn('[RedisService] Error in appendTranscript:', err.message);
    }
  }

  // Fallback in-memory
  let session = inMemoryStore.get(transcriptKey);
  if (!session || Date.now() > session.expiresAt) {
    session = { chunks: [], expiresAt: Date.now() + TTL_SECONDS * 1000 };
  }
  session.chunks.push(cleanText);
  session.expiresAt = Date.now() + TTL_SECONDS * 1000;
  inMemoryStore.set(transcriptKey, session);
  return true;
};

/**
 * Get full temporary transcript for a call
 */
const getTranscript = async (callId, userId) => {
  const transcriptKey = getTranscriptKey(callId, userId);

  if (isRedisConnected && redisClient) {
    try {
      const chunks = await redisClient.lrange(transcriptKey, 0, -1);
      return chunks ? chunks.join(' ') : '';
    } catch (err) {
      console.warn('[RedisService] Error in getTranscript:', err.message);
    }
  }

  // Fallback in-memory
  const session = inMemoryStore.get(transcriptKey);
  if (!session || Date.now() > session.expiresAt) return '';
  return session.chunks.join(' ');
};

/**
 * Save temporary grammar analysis report in Redis
 */
const saveGrammarReport = async (callId, userId, report) => {
  const grammarKey = getGrammarKey(callId, userId);
  const jsonString = JSON.stringify(report);

  if (isRedisConnected && redisClient) {
    try {
      await redisClient.set(grammarKey, jsonString, 'EX', TTL_SECONDS);
      return true;
    } catch (err) {
      console.warn('[RedisService] Error in saveGrammarReport:', err.message);
    }
  }

  // Fallback in-memory
  inMemoryStore.set(grammarKey, {
    data: jsonString,
    expiresAt: Date.now() + TTL_SECONDS * 1000,
  });
  return true;
};

/**
 * Retrieve temporary grammar report
 */
const getGrammarReport = async (callId, userId) => {
  const grammarKey = getGrammarKey(callId, userId);

  if (isRedisConnected && redisClient) {
    try {
      const jsonString = await redisClient.get(grammarKey);
      return jsonString ? JSON.parse(jsonString) : null;
    } catch (err) {
      console.warn('[RedisService] Error in getGrammarReport:', err.message);
    }
  }

  // Fallback in-memory
  const session = inMemoryStore.get(grammarKey);
  if (!session || Date.now() > session.expiresAt || !session.data) return null;
  try {
    return JSON.parse(session.data);
  } catch (e) {
    return null;
  }
};

/**
 * Explicitly delete all temporary transcript and grammar report data for a call session
 */
const deleteCallData = async (callId, userId) => {
  const transcriptKey = getTranscriptKey(callId, userId);
  const grammarKey = getGrammarKey(callId, userId);

  if (isRedisConnected && redisClient) {
    try {
      await redisClient.del(transcriptKey, grammarKey);
    } catch (err) {
      console.warn('[RedisService] Error in deleteCallData:', err.message);
    }
  }

  // Fallback in-memory
  inMemoryStore.delete(transcriptKey);
  inMemoryStore.delete(grammarKey);
  return true;
};

module.exports = {
  startSession,
  appendTranscript,
  getTranscript,
  saveGrammarReport,
  getGrammarReport,
  deleteCallData,
  getTranscriptKey,
  getGrammarKey,
  isRedisConnected: () => isRedisConnected,
};
