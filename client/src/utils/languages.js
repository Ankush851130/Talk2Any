export const WORLD_LANGUAGES = [
  { name: 'English', flag: '🇺🇸', code: 'en' },
  { name: 'Spanish', flag: '🇪🇸', code: 'es' },
  { name: 'French', flag: '🇫🇷', code: 'fr' },
  { name: 'German', flag: '🇩🇪', code: 'de' },
  { name: 'Japanese', flag: '🇯🇵', code: 'ja' },
  { name: 'Chinese', flag: '🇨🇳', code: 'zh' },
  { name: 'Korean', flag: '🇰🇷', code: 'ko' },
  { name: 'Arabic', flag: '🇸🇦', code: 'ar' },
  { name: 'Portuguese', flag: '🇵🇹', code: 'pt' },
  { name: 'Italian', flag: '🇮🇹', code: 'it' },
  { name: 'Russian', flag: '🇷🇺', code: 'ru' },
  { name: 'Turkish', flag: '🇹🇷', code: 'tr' },
  { name: 'Vietnamese', flag: '🇻🇳', code: 'vi' },
  { name: 'Indonesian', flag: '🇮🇩', code: 'id' },
  { name: 'Tagalog', flag: '🇵🇭', code: 'tl' },
  { name: 'Polish', flag: '🇵🇱', code: 'pl' },
  { name: 'Dutch', flag: '🇳🇱', code: 'nl' },
  { name: 'Thai', flag: '🇹🇭', code: 'th' },
  { name: 'Ukrainian', flag: '🇺🇦', code: 'uk' },
  { name: 'Swedish', flag: '🇸🇪', code: 'sv' },
  { name: 'Greek', flag: '🇬🇷', code: 'el' },
  { name: 'Persian', flag: '🇮🇷', code: 'fa' },
  { name: 'Hebrew', flag: '🇮🇱', code: 'he' },
  { name: 'Romanian', flag: '🇷🇴', code: 'ro' },
  { name: 'Hungarian', flag: '🇭🇺', code: 'hu' },
  { name: 'Czech', flag: '🇨🇿', code: 'cs' },
  { name: 'Finnish', flag: '🇫🇮', code: 'fi' },
  { name: 'Norwegian', flag: '🇳🇴', code: 'no' },
  { name: 'Danish', flag: '🇩🇰', code: 'da' },
  { name: 'Malay', flag: '🇲🇾', code: 'ms' },
  { name: 'Urdu', flag: '🇵🇰', code: 'ur' },

  // 🇮🇳 Indian Languages
  { name: 'Hindi', flag: '🇮🇳', code: 'hi' },
  { name: 'Bengali', flag: '🇮🇳', code: 'bn' },
  { name: 'Tamil', flag: '🇮🇳', code: 'ta' },
  { name: 'Telugu', flag: '🇮🇳', code: 'te' },
  { name: 'Marathi', flag: '🇮🇳', code: 'mr' },
  { name: 'Gujarati', flag: '🇮🇳', code: 'gu' },
  { name: 'Kannada', flag: '🇮🇳', code: 'kn' },
  { name: 'Malayalam', flag: '🇮🇳', code: 'ml' },
  { name: 'Punjabi', flag: '🇮🇳', code: 'pa' },
  { name: 'Odia', flag: '🇮🇳', code: 'or' },
  { name: 'Assamese', flag: '🇮🇳', code: 'as' },
  { name: 'Maithili', flag: '🇮🇳', code: 'mai' },
  { name: 'Sanskrit', flag: '🇮🇳', code: 'sa' },
  { name: 'Konkani', flag: '🇮🇳', code: 'kok' },
  { name: 'Kashmiri', flag: '🇮🇳', code: 'ks' },
  { name: 'Dogri', flag: '🇮🇳', code: 'doi' },
  { name: 'Sindhi', flag: '🇮🇳', code: 'sd' },
  { name: 'Nepali', flag: '🇮🇳', code: 'ne' },
  { name: 'Manipuri (Meitei)', flag: '🇮🇳', code: 'mni' },
  { name: 'Bodo', flag: '🇮🇳', code: 'brx' },
  { name: 'Santali', flag: '🇮🇳', code: 'sat' },
];

export const LANGUAGE_NAMES = WORLD_LANGUAGES.map((l) => l.name);

export const getLanguageFlag = (langName) => {
  if (!langName) return '🌐';
  const found = WORLD_LANGUAGES.find(
    (l) => l.name.toLowerCase() === langName.trim().toLowerCase()
  );
  return found ? found.flag : '🌐';
};
