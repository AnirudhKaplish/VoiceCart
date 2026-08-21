/**
 * Splits compound sentences into individual item phrases
 * e.g., "Add 2 apples, 1 kg rice and 3 bottles of water" -> ["2 apples", "1 kg rice", "3 bottles of water"]
 */

export function splitCompoundItems(input: string): string[] {
  let clean = input.trim();

  // Strip conversational prefixes
  clean = clean.replace(/^(?:please\s+)?(?:i\s+need|i\s+want\s+to\s+buy|i\s+want|i\s+would\s+like|add|put|buy|need|get|include|insert|kripya|jodo|serkavum)\s+(?:to\s+(?:my\s+)?(?:shopping\s+)?list\s+)?/i, '');
  clean = clean.replace(/\s+(?:to|on|in)\s+(?:my\s+)?(?:shopping\s+)?list$/i, '');

  // Replace conjunctions (and, &, plus, along with, with, Hindi: aur, tatha; Tamil: matrum) with delimiter
  const normalized = clean
    .replace(/\s+and\s+/gi, ', ')
    .replace(/\s+along\s+with\s+/gi, ', ')
    .replace(/\s+as\s+well\s+as\s+/gi, ', ')
    .replace(/\s+plus\s+/gi, ', ')
    .replace(/\s+&\s+/gi, ', ')
    .replace(/\s+aur\s+/gi, ', ')
    .replace(/\s+tatha\s+/gi, ', ')
    .replace(/\s+matrum\s+/gi, ', ')
    .replace(/\s+kooda\s+/gi, ', ');

  // Split by comma
  const chunks = normalized
    .split(',')
    .map(c => c.trim())
    .filter(c => c.length > 0);

  return chunks.length > 0 ? chunks : [clean];
}
