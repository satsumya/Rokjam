/** Canonical street-type forms and common AU/US abbreviations. */
const STREET_TYPE_GROUPS: string[][] = [
  ['road', 'rd'],
  ['street', 'st'],
  ['court', 'ct'],
  ['avenue', 'ave', 'av'],
  ['drive', 'dr'],
  ['lane', 'ln'],
  ['place', 'pl'],
  ['terrace', 'ter', 'tce'],
  ['boulevard', 'blvd'],
  ['highway', 'hwy'],
  ['crescent', 'cres'],
  ['parade', 'pde'],
  ['circuit', 'cct'],
  ['close', 'cl'],
];

const CANONICAL_BY_ALIAS = new Map<string, string>();
for (const group of STREET_TYPE_GROUPS) {
  const canonical = group[0];
  for (const alias of group) {
    CANONICAL_BY_ALIAS.set(alias, canonical);
  }
}

export function tokenizeAddress(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,/#'"]/g, ' ')
    .split(/\s+/)
    .map((token) => token.replace(/^\W+|\W+$/g, ''))
    .filter(Boolean);
}

/** Map rd/road (etc.) to one form so either spelling matches. */
export function canonicalizeAddressToken(token: string): string {
  return CANONICAL_BY_ALIAS.get(token) ?? token;
}

function tokensEquivalent(queryToken: string, suggestionToken: string): boolean {
  const query = canonicalizeAddressToken(queryToken);
  const suggestion = canonicalizeAddressToken(suggestionToken);
  if (query === suggestion) return true;
  // Partial typing: "ro" still matches "road" / "rd"→"road"
  if (query.length >= 2 && suggestion.startsWith(query)) return true;
  if (suggestion.length >= 2 && query.startsWith(suggestion)) return true;
  return false;
}

/** True when every query token matches the suggestion, allowing rd↔road style aliases. */
export function addressMatchesQuery(suggestion: string, query: string): boolean {
  const trimmed = query.trim();
  if (trimmed.length < 2) return false;

  const queryTokens = tokenizeAddress(trimmed);
  const suggestionTokens = tokenizeAddress(suggestion);
  if (queryTokens.length === 0) return false;

  // Expanded substring covers "montague ro" → "...montague road..."
  const expandedSuggestion = suggestionTokens.map(canonicalizeAddressToken).join(' ');
  const expandedQuery = queryTokens.map(canonicalizeAddressToken).join(' ');
  if (expandedSuggestion.includes(expandedQuery)) return true;

  // Order-preserving token match (aliases + prefixes)
  let from = 0;
  for (const queryToken of queryTokens) {
    let matched = false;
    for (let i = from; i < suggestionTokens.length; i += 1) {
      if (tokensEquivalent(queryToken, suggestionTokens[i])) {
        from = i + 1;
        matched = true;
        break;
      }
    }
    if (!matched) return false;
  }
  return true;
}

/**
 * Range to bold in the suggestion label. Prefers a literal substring; otherwise
 * covers the first–last matched tokens in the original string.
 */
export function findAddressHighlightRange(
  suggestion: string,
  query: string,
): { start: number; end: number } | null {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const literal = suggestion.toLowerCase().indexOf(trimmed.toLowerCase());
  if (literal >= 0) return { start: literal, end: literal + trimmed.length };

  if (!addressMatchesQuery(suggestion, trimmed)) return null;

  const queryTokens = tokenizeAddress(trimmed);
  const tokenPattern = /[A-Za-z0-9_'-]+/g;
  const spans: { start: number; end: number; token: string }[] = [];
  let match: RegExpExecArray | null;
  while ((match = tokenPattern.exec(suggestion)) !== null) {
    spans.push({ start: match.index, end: match.index + match[0].length, token: match[0].toLowerCase() });
  }

  let from = 0;
  let firstStart: number | null = null;
  let lastEnd: number | null = null;
  for (const queryToken of queryTokens) {
    for (let i = from; i < spans.length; i += 1) {
      if (tokensEquivalent(queryToken, spans[i].token)) {
        if (firstStart == null) firstStart = spans[i].start;
        lastEnd = spans[i].end;
        from = i + 1;
        break;
      }
    }
  }

  if (firstStart == null || lastEnd == null) return null;
  return { start: firstStart, end: lastEnd };
}
