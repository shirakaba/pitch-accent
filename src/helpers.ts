// TODO: Assess whether any more 捨て仮名 should be included.
// https://ja.wikipedia.org/wiki/捨て仮名
const sutegana = /[ぁぃぅぇぉゃゅょァィゥェォャュョ]/;
const vowels = /[あいうえおアイウエオ]/;
const codaNasal = /[んン]/;
const sokuon = /[っッ]/;
const endsInVowel = /.[あいうえおアイウエオ]$/;

export function* syllables(surface: string) {
  const graphemes = [...surface];

  let syllable = '';
  for (const grapheme of graphemes) {
    if (
      grapheme === 'ー' ||
      sokuon.test(grapheme) ||
      codaNasal.test(grapheme) ||
      // Prevents "アイオワ" from becoming [['ア', 'イ', 'オ'], ['ワ']].
      (vowels.test(grapheme) && !endsInVowel.test(syllable)) ||
      sutegana.test(grapheme)
    ) {
      syllable += grapheme;
      continue;
    }

    if (syllable) {
      yield [...morae(syllable)];
    }

    syllable = grapheme;
  }

  if (syllable) {
    yield [...morae(syllable)];
  }
}

/**
 * Gets the syllable weight.
 * @returns "L" for light, or "H" for heavy.
 */
export function weighSyllable(morae: string[]) {
  return morae.length <= 1 ? 'L' : 'H';
}

/**
 * Warning: I'm unfamiliar with epenthesis so not sure how correct this is.
 */
export function hasEpentheticVowel(mora: string) {
  return /[くすつぬむるずづぐクスツヌムルズヅグ]/.test(mora);
}

// TODO: We may find reason to include whether each mora is light or heavy, so
// may in future return an object rather than just a string.
// TODO: could generalise to reuse logic from syllables
export function* morae(surface: string) {
  const graphemes = [...surface];

  let mora = '';
  for (const grapheme of graphemes) {
    if (sutegana.test(grapheme)) {
      mora += grapheme;
      continue;
    }

    if (mora) {
      yield mora;
    }

    mora = grapheme;
  }

  if (mora) {
    yield mora;
  }
}

/**
 * Given a mora index, if the mora is deficient (non-head), finds the syllable
 * that that mora is in and returns the position of the head mora.
 *
 * Negative indices are supported, and count from the end.
 */
export function getHeadMoraPosition(index: number, syllables: string[][]) {
  const morae = syllables.flat(1);
  const indexAbs = Math.abs(index);

  let moraIndex = 0;
  for (const syllable of isPositive(index)
    ? syllables
    : [...syllables].reverse()) {
    for (let i = 0; i < syllable.length; i++, moraIndex++) {
      if (moraIndex === indexAbs) {
        // We've reached the syllable containing the expected mora. To my
        // understanding of "[2.2] Syllables as accent-bearing units", the
        // downstep must be on the mora occupying the head position of the
        // syllable. We add one to convert from zero-index to one-index.
        return morae.length - moraIndex - (syllable.length - i) + 1;
      }
    }
  }

  return null;

  // Handles -0 sanely
  function isPositive(n: number) {
    return 1 / (n * 0) === 1 / 0;
  }
}
