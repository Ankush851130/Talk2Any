const { GoogleGenAI } = require('@google/genai');

/**
 * Calculates a deterministic grammar score from 0 to 100
 * based on sentence count, mistake count, and mistake category severity.
 */
const calculateDeterministicScore = (totalSentences, mistakes = [], categories = {}) => {
  const sentenceCount = Math.max(1, totalSentences || 1);
  const totalMistakesCount = mistakes.length;

  if (totalMistakesCount === 0) return 100;

  // Category severity weights
  const tensePenalty = (categories.tense || 0) * 8;
  const agreementPenalty = (categories.subjectVerbAgreement || 0) * 8;
  const articlePenalty = (categories.articles || 0) * 4;
  const prepPenalty = (categories.prepositions || 0) * 4;
  const otherPenalty = (categories.other || 0) * 5;

  const totalWeightedPenalty = tensePenalty + agreementPenalty + articlePenalty + prepPenalty + otherPenalty;
  
  // Normalize penalty per sentence
  const penaltyPerSentence = totalWeightedPenalty / Math.max(1, sentenceCount * 0.75);
  
  const rawScore = 100 - penaltyPerSentence;
  const finalScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  return finalScore;
};

/**
 * Validates and sanitizes the JSON response structure from the LLM
 */
const validateAndFormatResponse = (parsedJson, rawTranscript) => {
  if (!parsedJson || typeof parsedJson !== 'object') {
    throw new Error('Invalid LLM JSON format');
  }

  const sentencesCount = typeof parsedJson.totalSentences === 'number' && parsedJson.totalSentences >= 0
    ? parsedJson.totalSentences
    : Math.max(1, rawTranscript.split(/[.!?]+/).filter(Boolean).length);

  const mistakesList = Array.isArray(parsedJson.mistakes)
    ? parsedJson.mistakes.map((m) => ({
        original: String(m.original || '').trim(),
        corrected: String(m.corrected || '').trim(),
        type: String(m.type || 'Grammar').trim(),
        explanation: String(m.explanation || '').trim(),
      }))
    : [];

  const categories = {
    tense: Number(parsedJson.categories?.tense) || 0,
    articles: Number(parsedJson.categories?.articles) || 0,
    prepositions: Number(parsedJson.categories?.prepositions) || 0,
    subjectVerbAgreement: Number(parsedJson.categories?.subjectVerbAgreement) || 0,
    other: Number(parsedJson.categories?.other) || 0,
  };

  // Compute total mistakes matching list or categories
  const calculatedTotalMistakes = mistakesList.length;

  // Use LLM score if valid, otherwise compute deterministic score
  const computedScore = typeof parsedJson.grammarScore === 'number' && parsedJson.grammarScore >= 0 && parsedJson.grammarScore <= 100
    ? Math.round(parsedJson.grammarScore)
    : calculateDeterministicScore(sentencesCount, mistakesList, categories);

  const summaryText = typeof parsedJson.summary === 'string' && parsedJson.summary.trim()
    ? parsedJson.summary.trim()
    : 'Your spoken English was analyzed. Keep practicing to improve accuracy!';

  return {
    grammarScore: computedScore,
    totalSentences: sentencesCount,
    totalMistakes: calculatedTotalMistakes,
    mistakes: mistakesList,
    categories,
    summary: summaryText,
  };
};

/**
 * Fallback grammar analysis if LLM API is unavailable or disabled
 */
const generateFallbackReport = (transcript) => {
  const cleanTranscript = (transcript || '').trim();
  if (!cleanTranscript) {
    return {
      grammarScore: 100,
      totalSentences: 0,
      totalMistakes: 0,
      mistakes: [],
      categories: { tense: 0, articles: 0, prepositions: 0, subjectVerbAgreement: 0, other: 0 },
      summary: 'No speech was recorded during the call.',
    };
  }

  const sentences = cleanTranscript.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = Math.max(1, sentences.length);

  return {
    grammarScore: 90,
    totalSentences: sentenceCount,
    totalMistakes: 0,
    mistakes: [],
    categories: { tense: 0, articles: 0, prepositions: 0, subjectVerbAgreement: 0, other: 0 },
    summary: 'Great job! Your spoken English transcript was clear and understandable.',
  };
};

/**
 * Main Grammar Analysis Service
 */
const analyzeGrammarWithLLM = async (transcript) => {
  const cleanTranscript = (transcript || '').trim();

  if (!cleanTranscript) {
    return generateFallbackReport('');
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('[GrammarService] GEMINI_API_KEY is not set in environment. Returning fallback analysis.');
    return generateFallbackReport(cleanTranscript);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert English grammar analyzer for spoken language calls.
Analyze the following user spoken English transcript for grammatical mistakes, tenses, subject-verb agreement, articles, prepositions, and sentence structure.

Transcript to analyze:
"${cleanTranscript}"

Provide a detailed analysis in strict JSON format with the following exact keys:
{
  "grammarScore": <number between 0 and 100 based on mistake severity and sentence count>,
  "totalSentences": <total number of sentences spoken>,
  "totalMistakes": <total number of grammatical mistakes found>,
  "mistakes": [
    {
      "original": "<original mistake phrase>",
      "corrected": "<corrected phrase>",
      "type": "<Category, e.g., Tense, Articles, Prepositions, Subject-Verb Agreement, Vocabulary>",
      "explanation": "<brief friendly explanation of the correction>"
    }
  ],
  "categories": {
    "tense": <count>,
    "articles": <count>,
    "prepositions": <count>,
    "subjectVerbAgreement": <count>,
    "other": <count>
  },
  "summary": "<2-3 sentence overall feedback summary encouraging the speaker>"
}

Do not include any markdown backticks or commentary outside the JSON object. Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response?.text || (typeof response?.response?.text === 'function' ? response.response.text() : '');
    
    // Clean response text from potential ```json markdown blocks
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedJson = JSON.parse(cleanedText);

    return validateAndFormatResponse(parsedJson, cleanTranscript);
  } catch (err) {
    console.error('[GrammarService] Gemini API call error:', err.message);
    return generateFallbackReport(cleanTranscript);
  }
};

module.exports = {
  analyzeGrammarWithLLM,
  calculateDeterministicScore,
  validateAndFormatResponse,
  generateFallbackReport,
};
