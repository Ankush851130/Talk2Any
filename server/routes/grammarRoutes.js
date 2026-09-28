const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  startSession,
  addTranscriptChunk,
  analyzeGrammar,
  getGrammarReport,
  deleteGrammarSession,
} = require('../controllers/grammarController');

const router = express.Router();

router.post('/start', protect, startSession);
router.post('/transcript', protect, addTranscriptChunk);
router.post('/analyze', protect, analyzeGrammar);
router.get('/report/:callId', protect, getGrammarReport);
router.delete('/:callId', protect, deleteGrammarSession);

module.exports = router;
