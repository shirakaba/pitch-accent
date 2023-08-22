/**
 * Tokenises an inflected verb or adjective as per the tokens we support.
 */
export function tokenize(surface: string) {
  const tokens = new Array<string>();

  // We do a first pass to find all particles that may be attached to the end.
  // They may be attached in combination.
  const terminalPatterns = [
    // False positives (or philosophical cases) in comments:
    'に', // 死に (literary conjunctive)
    'た', // 食べた (arguably a verb conjugation)
    'て', // 食べて (arguably a verb conjugation)
    'だけ', // 頂け (imperative)
    'ほど',
    'が',
    'から',
    'けれど',
    'けれども',
    'し', // 探し (literary conjunctive)
    'って', // 知って (conjunctive)
    'と',
    'なら',
    'しか',
    'のだ',
    'ので',
    'のに',
    'ば', // 見れば (arguably a verb conjugation)
    'そうだ',
    'みたいだ',
    'らしい',
    'ぐらい',
    'くらい',
    'どころか', // handle as two separate particles? どころ・か
    'ばかり',
    'まで',
    'ようだ', // handle as two separate particles? よう・だ
    'より',
    'だろう',
    'でしょう',
    // TODO: handle these in-app
    'です',
    'たら', // 食べたら (arguably a verb conjugation)
    'すぎる',
    'なる', // 甘くなる (beware of false positives e.g. 単なる, 異なる, 重なる)
  ];

  let fragment = surface;
  for (const pattern of terminalPatterns) {
    if (fragment.endsWith(pattern)) {
      fragment = fragment.slice(0, -pattern.length);
      tokens.unshift(pattern);
      break;
    }
  }

  // Hopefully by this point, all particles have been vanquished and we just
  // need to deinflect the verb/adjective.

  const patterns = [''];
  for (const pattern of patterns) {
    if (fragment.endsWith(pattern)) {
      return fragment.slice(0, -pattern.length);
    }
  }
  return null;
}

// function deinflectOnce(fragment: string) {
//   const patterns = [
//     'ようだ',
//     'みたいだ',
//     'ほど',
//     'だけ', // いただけます
//     'けれども',
//     'けれど',
//     'から', // わからない
//   ];
//   for (const pattern of patterns) {
//     if (fragment.endsWith(pattern)) {
//       return fragment.slice(0, -pattern.length);
//     }
//   }
//   return null;
// }
