import {
  syllables,
  getHeadMoraPosition,
  weighSyllable,
  hasEpentheticVowel,
  morae,
} from './helpers';
import { TokenNoun, Token } from './token';

export function noun(tokens: [TokenNoun, ...Token[]]) {
  const [n1, ...ns] = tokens;

  const n1Syllables = [...syllables(n1.surface)];
  const n1Morae = n1Syllables.flat(1);

  // This isn't a compound.
  if (!ns.length) {
    if (n1.accent !== undefined) {
      return n1.accent;
    }

    // TODO: this rule overlaps with [2.4] (you can have four-mora words that
    // are also trisyllabic), so we should figure out the best order to run this
    // rule (or even run it in two conditional branches).
    // [3] Stochastic skews in native and Sino-Japanese nouns
    if (n1Syllables.length === 3) {
      // This rule is accurate 95%+ of the time for nouns that are of
      // Sino-Japanese origin or are loanwords. It's accurate 59% of the time
      // for words of native Japanese origin, which is better than nothing.
      const antepenultimateIndex = -2;
      return getHeadMoraPosition(antepenultimateIndex, n1Syllables);
    }

    // TODO: if n1 has a null accent, we can use the AAR (2.1) or LSR (2.3)
    // rules to guess.

    // [2.4] Unaccented loanwords
    if (n1.origin === 'loanword' && n1Morae.length === 4) {
      if (n1Syllables.slice(-2).map(weighSyllable).join('') === 'LL') {
        const lastTwoMorae = n1Syllables.flat(1).slice(-2);
        // [16] Unaccented loanwords: four mora words with two final light
        // non-epenthetic syllables
        if (!lastTwoMorae.some(hasEpentheticVowel)) {
          return 0;
        }

        // [17] The presence of an epenthetic vowel results in accented words
        if (lastTwoMorae.some(hasEpentheticVowel)) {
          // There will be an accent, normally two morae back from the final
          // epenthetic vowel. Fails in the case of 17h, but generally works.
          const lastEpentheticVowelIndexFromEnd =
            n1Morae.length -
            1 -
            n1Morae.map(hasEpentheticVowel).lastIndexOf(true);
          if (lastEpentheticVowelIndexFromEnd === -1) {
            return null;
          }

          const expectedMoraIndex = lastEpentheticVowelIndexFromEnd + 2;
          return getHeadMoraPosition(-expectedMoraIndex, n1Syllables);
        }

        // TODO: 18-20
      }
    }

    return null;
  }

  // We only have a rule for N1 + N2.
  if (ns.length > 1) {
    return null;
  }

  const n2 = ns[0];
  const n2Morae = [...morae(n2.surface)];

  // [4.1] TODO: solve monomoraic and bimoraic.
  if (n2Morae.length <= 2) {
    return null;
  }

  // Need data to be sure.
  if (n2.accent === undefined) {
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

  const n2MoraeUpToLastSyllable = n2Syllables.slice(0, -1).flat();

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
