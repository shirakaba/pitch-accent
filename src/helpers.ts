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