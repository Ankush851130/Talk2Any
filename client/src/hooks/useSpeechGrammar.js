import { useState, useEffect, useRef, useCallback } from 'react';
import { grammarApi } from '../services/grammarApi';

export const useSpeechGrammar = (callId) => {
  const [isGrammarEnabled, setIsGrammarEnabled] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [report, setReport] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [grammarError, setGrammarError] = useState(null);

  const recognitionRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const transcriptBufferRef = useRef('');
  const isEnabledRef = useRef(isGrammarEnabled);

  useEffect(() => {
    isEnabledRef.current = isGrammarEnabled;
  }, [isGrammarEnabled]);

  // Check Web Speech API browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  // Flush transcript buffer to server
  const flushTranscriptBuffer = useCallback(
    async (rId) => {
      const activeCallId = rId || callId;
      const textToSend = transcriptBufferRef.current.trim();
      if (!activeCallId || !textToSend) return;

      transcriptBufferRef.current = '';
      try {
        await grammarApi.sendTranscriptChunk(activeCallId, textToSend);
      } catch (err) {
        console.warn('[useSpeechGrammar] Failed to send transcript chunk:', err.message);
      }
    },
    [callId]
  );

  // Initialize and start Speech Recognition
  const startRecognition = useCallback(async () => {
    if (!callId) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setGrammarError('Speech Recognition is not supported in this browser.');
      return;
    }

    try {
      await grammarApi.startSession(callId);
    } catch (err) {
      console.warn('[useSpeechGrammar] Start session warning:', err.message);
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsAnalyzing(true);
      setGrammarError(null);
    };

    recognition.onresult = (event) => {
      let finalTranscriptChunk = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptChunk += ' ' + transcriptPart;
        }
      }

      if (finalTranscriptChunk.trim()) {
        transcriptBufferRef.current += ' ' + finalTranscriptChunk.trim();

        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => {
          flushTranscriptBuffer(callId);
        }, 1500);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        setGrammarError('Microphone permission denied for speech recognition.');
        setIsGrammarEnabled(false);
        setIsAnalyzing(false);
      } else if (event.error !== 'no-speech') {
        console.warn('[useSpeechGrammar] Recognition error:', event.error);
      }
    };

    recognition.onend = () => {
      // Auto restart if still enabled
      if (isEnabledRef.current) {
        try {
          recognition.start();
        } catch (e) {
          setIsAnalyzing(false);
        }
      } else {
        setIsAnalyzing(false);
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('[useSpeechGrammar] Failed to start recognition:', err.message);
      setIsAnalyzing(false);
    }
  }, [callId, flushTranscriptBuffer]);

  // Stop Speech Recognition
  const stopRecognition = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (callId) {
      flushTranscriptBuffer(callId);
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsAnalyzing(false);
  }, [callId, flushTranscriptBuffer]);

  // Toggle AI Grammar mode
  const toggleGrammar = useCallback(() => {
    setIsGrammarEnabled((prev) => {
      const nextState = !prev;
      if (nextState) {
        startRecognition();
      } else {
        stopRecognition();
      }
      return nextState;
    });
  }, [startRecognition, stopRecognition]);

  // Trigger final grammar analysis on call end
  const triggerFinalAnalysis = useCallback(async () => {
    if (!callId) return null;

    stopRecognition();

    setLoadingReport(true);
    try {
      // Flush any remaining buffer before analyzing
      await flushTranscriptBuffer(callId);

      const res = await grammarApi.analyzeGrammar(callId);
      if (res.success && res.report) {
        setReport(res.report);
        setIsReportModalOpen(true);
        return res.report;
      }
    } catch (err) {
      console.error('[useSpeechGrammar] Error analyzing grammar:', err.message);
      const fallback = {
        grammarScore: 85,
        totalSentences: 1,
        totalMistakes: 0,
        mistakes: [],
        categories: { tense: 0, articles: 0, prepositions: 0, subjectVerbAgreement: 0, other: 0 },
        summary: 'Your speech was recorded. Analysis failed to reach LLM server.',
      };
      setReport(fallback);
      setIsReportModalOpen(true);
      return fallback;
    } finally {
      setLoadingReport(false);
    }
  }, [callId, stopRecognition, flushTranscriptBuffer]);

  // Close modal and explicitly wipe temporary data from Redis
  const closeReportModal = useCallback(async () => {
    setIsReportModalOpen(false);
    if (callId) {
      try {
        await grammarApi.deleteSession(callId);
      } catch (err) {
        console.warn('[useSpeechGrammar] Failed to clean up Redis session:', err.message);
      }
    }
    setReport(null);
  }, [callId]);

  return {
    isGrammarEnabled,
    isAnalyzing,
    isSupported,
    report,
    isReportModalOpen,
    loadingReport,
    grammarError,
    toggleGrammar,
    triggerFinalAnalysis,
    closeReportModal,
  };
};
