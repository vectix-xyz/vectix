import LanguageDetect from 'languagedetect';
import slugify from 'slugify';

const lngDetector = new LanguageDetect();

export const generateSlug = (text: string): string => {
  const detectedLanguages = lngDetector.detect(text);

  let detectedLocale = 'uk';

  if (detectedLanguages.length > 0) {
    const topLanguage = detectedLanguages[0]?.[0];
    if (topLanguage === 'russian') {
      detectedLocale = 'ru';
    }
  }

  return slugify(text, {
    replacement: '-',
    lower: true,
    strict: true,
    locale: detectedLocale,
    trim: true,
  });
};
