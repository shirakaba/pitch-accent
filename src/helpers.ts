// TODO: Assess whether any more 捨て仮名 should be included.
// https://ja.wikipedia.org/wiki/捨て仮名
const combiners = /[ぁぃぅぇぉゃゅょァィゥェォャュョ]/;
const vowels = /[あいうえおアイウエオ]/;
const stops = /[んン]/;
const sokuon = /[っッ]/;

export function* syllables(surface: string) {
  const graphemes = [...surface];

  let syllable = '';
  for (const grapheme of graphemes) {
    if (
      grapheme === 'ー' ||
      sokuon.test(grapheme) ||
      stops.test(grapheme) ||
      vowels.test(grapheme) ||
      combiners.test(grapheme)
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
    if (combiners.test(grapheme)) {
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
 * Given a mora index from end, if the mora is deficient (non-head), finds the
 * syllable that that mora is in and returns the position of the head mora from
 * that syllable .
 */
export function getHeadMoraPosition(
  indexFromEnd: number,
  syllables: string[][]
) {
  const morae = syllables.flat(1);

  let moraIndex = 0;
  for (const syllable of syllables.reverse()) {
    for (let i = 0; i < syllable.length; i++, moraIndex++) {
      if (moraIndex === indexFromEnd) {
        // We've reached the syllable containing the expected mora. To my
        // understanding of "[2.2] Syllables as accent-bearing units", the
        // downstep must be on the mora occupying the head position of the
        // syllable. We add one to convert from zero-index to one-index.
        return morae.length - moraIndex - (syllable.length - i) + 1;
      }
    }
  }

  return null;
}
