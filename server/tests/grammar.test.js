const test = require('node:test');
const assert = require('node:assert/strict');
const grammarService = require('../services/grammarService');
const redisService = require('../services/redisService');

test('Grammar Score Calculation - Deterministic Scoring', () => {
  // Case 1: Zero mistakes = 100 score
  const score100 = grammarService.calculateDeterministicScore(10, [], {});
  assert.equal(score100, 100);

  // Case 2: Mistakes with categories (Tense and Subject-Verb Agreement)
  const scoreWithMistakes = grammarService.calculateDeterministicScore(5, [
    { original: 'I am go', corrected: 'I am going', type: 'Tense' },
    { original: 'He have', corrected: 'He has', type: 'Subject-Verb Agreement' }
  ], {
    tense: 1,
    subjectVerbAgreement: 1,
  });
  assert.ok(scoreWithMistakes < 100 && scoreWithMistakes >= 0);

  // Case 3: Score is clamped between 0 and 100
  const clampedScore = grammarService.calculateDeterministicScore(1, Array(20).fill({ type: 'Tense' }), { tense: 20 });
  assert.equal(clampedScore, 0);
});

test('Grammar Analysis LLM Response Validation', () => {
  const sampleTranscript = 'I am go to college yesterday.';
  const rawLlmJson = {
    grammarScore: 75,
    totalSentences: 1,
    totalMistakes: 1,
    mistakes: [
      {
        original: 'I am go to college yesterday',
        corrected: 'I went to college yesterday',
        type: 'Tense',
        explanation: 'Use the past tense form "went".'
      }
    ],
    categories: { tense: 1, articles: 0, prepositions: 0, subjectVerbAgreement: 0, other: 0 },
    summary: 'Practice past tenses.'
  };

  const formatted = grammarService.validateAndFormatResponse(rawLlmJson, sampleTranscript);

  assert.equal(formatted.grammarScore, 75);
  assert.equal(formatted.totalSentences, 1);
  assert.equal(formatted.totalMistakes, 1);
  assert.equal(formatted.mistakes[0].original, 'I am go to college yesterday');
  assert.equal(formatted.mistakes[0].corrected, 'I went to college yesterday');
  assert.equal(formatted.categories.tense, 1);
});

test('Empty Transcript Handling', () => {
  const report = grammarService.generateFallbackReport('');
  assert.equal(report.grammarScore, 100);
  assert.equal(report.totalSentences, 0);
  assert.equal(report.totalMistakes, 0);
  assert.equal(report.mistakes.length, 0);
});

test('Redis Temporary Session Data Flow & Cleanup', async () => {
  const callId = 'test_call_123';
  const userId = 'user_456';

  // 1. Start Session
  await redisService.startSession(callId, userId);

  // 2. Append Chunks
  await redisService.appendTranscript(callId, userId, 'I am go to store yesterday.');
  await redisService.appendTranscript(callId, userId, 'I buy some bread.');

  // 3. Get Combined Transcript
  const combined = await redisService.getTranscript(callId, userId);
  assert.equal(combined, 'I am go to store yesterday. I buy some bread.');

  // 4. Save Grammar Report
  const mockReport = { grammarScore: 80, totalMistakes: 2 };
  await redisService.saveGrammarReport(callId, userId, mockReport);

  const retrievedReport = await redisService.getGrammarReport(callId, userId);
  assert.deepEqual(retrievedReport, mockReport);

  // 5. Delete Session Data
  await redisService.deleteCallData(callId, userId);

  const afterDeleteTranscript = await redisService.getTranscript(callId, userId);
  const afterDeleteReport = await redisService.getGrammarReport(callId, userId);

  assert.equal(afterDeleteTranscript, '');
  assert.equal(afterDeleteReport, null);
});
