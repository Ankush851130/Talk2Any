const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const redisService = require('../services/redisService');
const grammarService = require('../services/grammarService');
const speechToTextService = require('../services/speechToTextService');

/**
 * @desc    Start an AI Grammar session for a call
 * @route   POST /api/grammar/start
 * @access  Private
 */
const startSession = catchAsync(async (req, res, next) => {
  const { callId } = req.body;
  if (!callId) {
    return next(new AppError('callId is required to start a grammar session', 400));
  }

  const userId = req.user._id.toString();
  await redisService.startSession(callId, userId);

  res.status(200).json({
    success: true,
    message: 'AI Grammar session started',
    callId,
    ttlSeconds: 3600,
  });
});

/**
 * @desc    Append transcript chunk during an active call
 * @route   POST /api/grammar/transcript
 * @access  Private
 */
const addTranscriptChunk = catchAsync(async (req, res, next) => {
  const { callId, text } = req.body;

  if (!callId) {
    return next(new AppError('callId is required', 400));
  }

  const cleanText = speechToTextService.sanitizeTranscriptChunk(text);
  if (!cleanText) {
    return res.status(200).json({ success: true, message: 'Empty transcript chunk ignored' });
  }

  const userId = req.user._id.toString();
  await redisService.appendTranscript(callId, userId, cleanText);

  res.status(200).json({
    success: true,
    message: 'Transcript chunk added',
  });
});

/**
 * @desc    Trigger final grammar analysis when the call ends
 * @route   POST /api/grammar/analyze
 * @access  Private
 */
const analyzeGrammar = catchAsync(async (req, res, next) => {
  const { callId } = req.body;

  if (!callId) {
    return next(new AppError('callId is required to analyze call', 400));
  }

  const userId = req.user._id.toString();
  const transcript = await redisService.getTranscript(callId, userId);

  // Perform grammar analysis using LLM or deterministic fallback
  const report = await grammarService.analyzeGrammarWithLLM(transcript);

  // Store temporary report in Redis so user can view/refresh before closing
  await redisService.saveGrammarReport(callId, userId, report);

  res.status(200).json({
    success: true,
    callId,
    report,
  });
});

/**
 * @desc    Get temporary grammar report
 * @route   GET /api/grammar/report/:callId
 * @access  Private
 */
const getGrammarReport = catchAsync(async (req, res, next) => {
  const { callId } = req.params;
  const userId = req.user._id.toString();

  const report = await redisService.getGrammarReport(callId, userId);

  if (!report) {
    return next(new AppError('No temporary grammar report found for this call session', 404));
  }

  res.status(200).json({
    success: true,
    callId,
    report,
  });
});

/**
 * @desc    Delete temporary transcript and grammar analysis data from Redis
 * @route   DELETE /api/grammar/:callId
 * @access  Private
 */
const deleteGrammarSession = catchAsync(async (req, res, next) => {
  const { callId } = req.params;
  const userId = req.user._id.toString();

  await redisService.deleteCallData(callId, userId);

  res.status(200).json({
    success: true,
    message: `Temporary transcript and grammar report deleted for call ${callId}`,
  });
});

module.exports = {
  startSession,
  addTranscriptChunk,
  analyzeGrammar,
  getGrammarReport,
  deleteGrammarSession,
};
