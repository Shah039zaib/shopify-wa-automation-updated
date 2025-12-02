import franc from 'franc';
import langs from 'langs';

/**
 * detectLanguage - returns object { code: 'eng', name: 'English' } or { code: 'und', name: 'Unknown' }
 */
export function detectLanguage(text: string) {
  if (!text || typeof text !== 'string' || text.trim().length < 3) {
    return { code: 'und', name: 'Unknown' };
  }
  try {
    const iso3 = franc(text, { minLength: 3 });
    if (!iso3 || iso3 === 'und') return { code: 'und', name: 'Unknown' };
    const info = langs.where('3', iso3) || langs.where('1', iso3) || null;
    const name = info ? info.name : iso3;
    return { code: iso3, name };
  } catch (e) {
    return { code: 'und', name: 'Unknown' };
  }
}
