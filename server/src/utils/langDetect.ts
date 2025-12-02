// server/src/utils/langDetect.ts
// Simple, robust language detector using franc + langs.
// Using require() to avoid TypeScript call-signature typing issues.

const franc: any = require('franc');
const langs: any = require('langs');

/**
 * detectLanguage - returns object { code: 'eng', name: 'English' } or { code: 'und', name: 'Unknown' }
 * Usage: const { code, name } = detectLanguage("some text");
 */
export function detectLanguage(text: string) {
  if (!text || typeof text !== 'string' || text.trim().length < 3) {
    return { code: 'und', name: 'Unknown' };
  }
  try {
    // franc returns ISO 639-3 code (e.g., 'eng')
    const iso3 = franc(text, { minLength: 3 });
    if (!iso3 || iso3 === 'und') return { code: 'und', name: 'Unknown' };
    const info = langs.where('3', iso3) || langs.where('1', iso3) || null;
    const name = info ? info.name : iso3;
    return { code: iso3, name };
  } catch (e) {
    return { code: 'und', name: 'Unknown' };
  }
}
