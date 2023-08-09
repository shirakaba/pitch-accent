import { morae, syllables } from './helpers';

export function solve(tokens: [Token, ...Token[]]) {
  switch (tokens[0].pos) {
    case 'verb':
      return verb(tokens as [TokenVerb, ...Token[]]);
    case 'noun':
      return noun(tokens as [TokenNoun, ...Token[]]);
    default:
      return null;
  }
}

export function verb(tokens: [TokenVerb, ...Token[]]) {
  // tokens
}

export function noun(tokens: [TokenNoun, ...Token[]]) {
  const [n1, ...ns] = tokens;

  // This isn't a compound.
  if (!ns.length) {
    return n1.accent;
  }

  // We only have a rule for N1 + N2.
  if (ns.length > 1) {
    return null;
  }

  const n2 = ns[0];
  const n1Morae = [...morae(n1.surface)];
  const n2Morae = [...morae(n2.surface)];

  // [4.1] TODO: solve monomoraic and bimoraic.
  if (n2Morae.length <= 2) {
    return null;
  }

  // Need data to be sure.
  if (n2.accent === null) {
    return null;
  }

  // (26) Superlong N2
  if (n2Morae.length >= 5) {
    return n2.accent ? n1Morae.length + n2.accent : 0;
  }

  // This leaves N2 of 3-4 morae.

  // Accent is counted by mora. So, for 納豆（なっとう）:
  // ０１２③４５ accent
  // 　なっとうが
  //  "なっとう"     string
  //   ０１２３      index
  // 　natto'u      academic
  // 　なっ・とう     syllables
  // 　な・っ・と・う  morae
  // Note that ちょしゃ is two morae.

  const n2Syllables = [...syllables(n2.surface)];

  // If the N2 has three or more morae yet has only one syllable, it may be out
  // of scope for the rule. I'm not even sure such a word is valid, in any case.
  if (n2Syllables.length < 2) {
    return null;
  }

  const n2SyllablesIntoMorae = n2Syllables.map((s) => [...morae(s)]);
  const n2MoraeUpToLastSyllable = n2SyllablesIntoMorae.slice(0, -1).flat();

  // [4.2] Long N2
  // [23] N2 Initial accent
  if (
    // > If N2 is unaccented...
    n2.accent === 0 ||
    // > ... or has accent on the final syllable...
    n2.accent > n2MoraeUpToLastSyllable.length
  ) {
    // > ... then the accent falls on the initial syllable of N2.
    // Syllables may contain multiple morae, e.g.:
    // ["な", "っ"]
    // ["ら", "ん"]
    // ["の", "お"]
    // ["ノ", "ー"]
    // ["さ", "い"]
    // In all of these cases, the downstep occurs essentially on the first mora
    // of the syllable, to my best understanding of "[2.2] Syllables as
    // accent-bearing units".
    return n1Morae.length + 1;
  }

  // [24] Retention of N2 accent
  // > ... otherwise, the accent of N2 is retained.
  return n1Morae.length + n2.accent;

  // [25] Variation between initial accenting and retention of N2 accent
  // Technically in penultimate accent cases of [24] there may be more than one
  // accepted downstep position. But as the position from the [24] rule is also
  // valid in the options given by [25], we might as well settle on the [24]
  // rule alone.
}

type Token = TokenVerb | TokenNoun;

interface TokenCommon {
  /**
   * The surface form of the token.
   */
  surface: string;
  /**
   * The pitch accent for the token. If multiple are possible (e.g. "0,3"), take
   * the most likely.
   */
  accent: number | null;
}

interface TokenNoun extends TokenCommon {
  pos: 'noun';
}
interface TokenVerb extends TokenCommon {
  pos: 'verb';
}
