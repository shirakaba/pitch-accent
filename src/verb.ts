import { morae } from './helpers';
import { UniDicToken } from './inflection';
import { TokenVerb, Token } from './token';

export function verb(tokens: [TokenVerb, ...Token[]]) {
  const [v1, ...vs] = tokens;

  if (v1.accent === undefined) {
    return null;
  }

  if (!vs.length) {
    return v1.accent;
  }

  if (vs.length !== 1) {
    // Don't want to think about stringing multiple auxiliaries together just
    // yet.
    return null;
  }

  const v2 = vs[0];
  if (v2.pos !== 'auxiliary verb') {
    return null;
  }

  /**
   * Ren'youkei (-masu stem):
   * hareru -> hare
   * yorokobu -> yorokobi
   *
   * Onbinkei:
   * hareru -> hare
   * yorokobu -> yoroko
   */
  const onbinkei = conjugate(v1, 'onbinkei');
  if (!onbinkei) {
    return null;
  }

  const onbinkeiMorae = [...morae(onbinkei)];

  switch (v1.group) {
    // C-final
    case 'godan':
      // FIXME: instead of switching on surface, switch on negative form, etc.
      switch (v2.surface) {
        case 'ない':
          return onbinkeiMorae.length + 1;
        case 'ます':
          return onbinkeiMorae.length + 2;
        case 'る':
        case 'て':
        case 'た':
        case 'れば':
          return onbinkeiMorae.length;
        case 'よう':
          return onbinkeiMorae.length + 1;
      }
      return null;
    // V-final
    case 'ichidan':
      if (v1.accent === 0) {
        if (['ます', 'れば', 'よう'].includes(v2.surface)) {
          return onbinkeiMorae.length + 1;
        }
        return 0;
      }

      // TODO: check the precise rules for this - Dogen likely specified them.
      switch (v2.surface) {
        case 'ない':
          return onbinkeiMorae.length;
        case 'ます':
          return onbinkeiMorae.length + 1;
        case 'る':
          return v1.accent;
        case 'て':
        case 'た':
          return onbinkeiMorae.length - 1;
        case 'れば':
          return onbinkeiMorae.length;
        case 'よう':
          return onbinkeiMorae.length + 1;
      }

      return null;
    // TODO
    case 'suru':
    case 'kuru':
      return null;
  }
}

// https://en.wikipedia.org/wiki/Japanese_conjugation
export function conjugate(verb: TokenVerb, base: Base) {
  switch (verb.group) {
    case 'godan':
      return conjugateGodan(verb, base);
    case 'ichidan':
      return conjugateIchidan(verb, base);
    case 'suru':
      return conjugateSuru(verb, base);
    case 'kuru':
      return conjugateKuru(verb, base);
  }
}

export function conjugateGodan(verb: TokenVerb, base: Base) {
  const baseMorae = [...morae(verb.baseForm)];
  /**
   * @example 言う -> 言
   * @example 作る -> 作
   */
  const onbinkei = baseMorae.slice(0, -1).join('');
  /**
   * @example 言う -> う
   * @example 作る -> る
   */
  const finalChar = baseMorae.slice(-1).join('');
  if (!isVerbEnd(finalChar)) {
    return null;
  }

  switch (base) {
    case 'shuushikei':
    case 'rentaikei':
      return verb.baseForm;
    case 'kateikei':
    case 'kanoukei':
    case 'meireikei':
      return `${onbinkei}${shiftChar(finalChar, 'え')}`;
    case 'mizenkei':
      return `${onbinkei}${shiftChar(finalChar, 'あ')}`;
    case 'ishikei':
      return `${onbinkei}${shiftChar(finalChar, 'お')}`;
    case "ren'youkei":
      return `${onbinkei}${shiftChar(finalChar, 'い')}`;
    case 'onbinkei':
      return onbinkei;
  }
}

export function conjugateIchidan(verb: TokenVerb, base: Base) {
  const baseMorae = [...morae(verb.baseForm)];

  switch (base) {
    case 'shuushikei':
    case 'rentaikei':
      return verb.baseForm;
    case 'kateikei':
    case 'kanoukei':
    case 'meireikei':
    case 'mizenkei':
    case 'ishikei':
    case "ren'youkei":
    case 'onbinkei':
      return baseMorae.slice(0, -1).join('');
  }
}
export function conjugateKuru(verb: TokenVerb, base: Base) {
  const baseMorae = [...morae(verb.baseForm)];
  switch (base) {
    case 'shuushikei':
    case 'rentaikei':
      return verb.baseForm;
    case 'kateikei':
      return `${baseMorae[0]}れ`;
    case 'kanoukei':
    case 'mizenkei':
    case 'ishikei':
      return baseMorae[0] === '来' ? '来' : 'こ';
    case 'meireikei':
      return `${baseMorae[0] === '来' ? '来' : 'こ'}い`;
    case "ren'youkei":
    case 'onbinkei':
      return baseMorae[0] === '来' ? '来' : 'き';
  }
}

export function conjugateSuru(verb: TokenVerb, base: Base) {
  const baseMorae = [...morae(verb.baseForm)];

  // TODO: Check how UniDic represents these, as Base seems insufficient as-is.
  switch (base) {
    case 'shuushikei':
    case 'rentaikei':
      return verb.baseForm;
    case 'kateikei':
      return `${baseMorae[0]}れ`;
    case 'kanoukei':
      // 出来る, 出きる and 出來る are also valid (but who cares about orthography)
      return 'できる';
    case 'meireikei':
      // FIXME: せよ is also possible
      return `${baseMorae[0] === '為' ? '為' : 'し'}ろ`;
    case 'mizenkei':
      // FIXME: し and せ are also possible
      return `${baseMorae[0] === '為' ? '為' : 'さ'}`;
    case 'ishikei':
    case "ren'youkei":
    case 'onbinkei':
      return `${baseMorae[0] === '為' ? '為' : 'し'}`;
  }
}

const hiraganaTable = [
  ['あ', 'い', 'う', 'え', 'お'],
  ['か', 'き', 'く', 'け', 'こ'],
  ['が', 'ぎ', 'ぐ', 'げ', 'ご'],
  ['さ', 'し', 'す', 'せ', 'そ'],
  ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'],
  ['た', 'ち', 'つ', 'て', 'と'],
  ['だ', 'ぢ', 'づ', 'で', 'ど'],
  ['な', 'に', 'ぬ', 'ね', 'の'],
  ['は', 'ひ', 'ふ', 'へ', 'ほ'],
  ['ば', 'び', 'ぶ', 'べ', 'ぼ'],
  ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'],
  ['ま', 'み', 'む', 'め', 'も'],
  ['や', 'ー', 'ゆ', 'ー', 'よ'],
  ['ら', 'り', 'る', 'れ', 'ろ'],
  ['わ', 'ゐ', 'ー', 'ゑ', 'を'],
] as const;

export function shiftChar(char: VerbEnd, col: Vowel) {
  if (char === 'う' && col === 'あ') {
    return 'わ';
  }

  let rowIndex = -1;
  let colIndex = -1;
  for (const [r, row] of hiraganaTable.entries()) {
    for (const [c, col] of row.entries()) {
      if (col === char) {
        rowIndex = r;
        colIndex = c;
        break;
      }
    }
  }

  if (rowIndex === -1 || colIndex === -1) {
    return null;
  }

  const targetColIndex = hiraganaTable[0].indexOf(col);
  if (targetColIndex === -1) {
    return null;
  }

  const target = hiraganaTable[rowIndex][targetColIndex];
  return target === 'ー' ? null : target;
}

function isVerbEnd(text: string): text is VerbEnd {
  return /^[うくぐすずつづぬふぶぷむゆる]$/.test(text);
}

type VerbEnd =
  | 'う'
  | 'く'
  | 'ぐ'
  | 'す'
  | 'ず'
  | 'つ'
  | 'づ'
  | 'ぬ'
  | 'ふ'
  | 'ぶ'
  | 'ぷ'
  | 'む'
  | 'ゆ'
  | 'る';

type Vowel = 'あ' | 'い' | 'う' | 'え' | 'お';

export type Base =
  | 'shuushikei'
  | 'rentaikei'
  | 'kateikei'
  | 'kanoukei'
  | 'mizenkei'
  | 'meireikei'
  | 'ishikei'
  | "ren'youkei"
  | 'onbinkei';

type TokenAffix = { surface: string; type: string };

// Current thinking: chomp backward until we reach something unchompable (thus
// finding the stem), then chomp forward to get things beyond the word like
// 〜ようです and 〜気がします.
//
// New thinking: recognising when a verb stem stops and the affixes start is
// very complex, particularly without a dictionary. There are also surely way
// more affixes in here than I've thought of.
//
// ... So it's probably better to support IPADIC/UniDic tokens as input.
//
// TODO: think about 食べさせられたくなかったようです

export function getPitch(text: string) {
  let tokensAcc: TokenAffix[] = [];
  const graphemes = [...text];
  let acc = '';
  for (let i = 0; i < graphemes.length; i++) {
    const fragment = graphemes.slice(i).join('');
    const tokens = findAffix(fragment, 'start');
    if (!tokens) {
      acc += graphemes[i];
      continue;
    }
    tokensAcc.push(...tokens);
  }
}

export function deinflect(verb: string) {
  let tokensAcc: TokenAffix[] = [];
  let remaining = verb;
  let acc = '';
  while (acc !== verb) {
    const tokens = findAffix(remaining, 'end') ?? [
      { surface: remaining, type: 'stem' },
    ];
    const end = tokens.map((t) => t.surface).join('');
    acc += `${end}${acc}`;
    remaining = remaining.slice(0, -end.length);
    tokensAcc.unshift(...tokens);
    if (tokens[0].type === 'stem') {
      break;
    }
  }

  return tokensAcc;
}

function findAffix(wordFragment: string, end: 'start' | 'end') {
  // TODO: should desu and masu both be filed under "polite"?
  // TODO: how should we categorise potential vs. passive?

  const test = (pattern: string) =>
    end === 'start'
      ? wordFragment.startsWith(pattern)
      : wordFragment.endsWith(pattern);

  // See https://upload.wikimedia.org/wikipedia/commons/6/68/AMB_Japanese_Verbs.pdf
  if (test('られた')) {
    return [
      { surface: 'られ', type: 'passive' },
      { surface: 'た', type: 'perfective' },
    ];
  } else if (test('させた')) {
    return [
      { surface: 'させ', type: 'passive' },
      { surface: 'た', type: 'perfective' },
    ];
  } else if (test('ません')) {
    return [
      { surface: 'ませ', type: 'polite' },
      // Technically this is not 'negative', but I still need to decide how
      // closely we're going to align with IPADIC/UniDic:
      // IPADIC: 助動詞,*,*,*,不変化型,基本形,ん,ン,ン
      // UniDic: 助動詞,*,*,*,助動詞-ヌ,終止形-撥音便,ズ,ず,ん,ン,ぬ,ヌ,和,*,*,*,*,*,*,助動,ン,ヌ,ン,ヌ,*,動詞%F4@0,*,5384050776875693,19587
      { surface: 'ん', type: 'negative' },
    ];
  } else if (test('ました')) {
    return [
      { surface: 'まし', type: 'polite' },
      { surface: 'た', type: 'perfective' },
    ];
  } else if (test('でした')) {
    return [
      { surface: 'でし', type: 'polite' },
      { surface: 'た', type: 'perfective' },
    ];
  } else if (test('まして')) {
    return [
      { surface: 'まし', type: 'polite' },
      { surface: 'て', type: 'te' },
    ];
  } else if (test('なかった')) {
    return [
      { surface: 'なかっ', type: 'negative' },
      { surface: 'た', type: 'perfective' },
    ];
  } else if (test('たかった')) {
    return [
      { surface: 'たかっ', type: 'desiderative' },
      { surface: 'た', type: 'perfective' },
    ];
  } else if (test('なくて')) {
    return [
      { surface: 'なく', type: 'negative' },
      { surface: 'て', type: 'te' },
    ];
  } else if (test('たく')) {
    return [{ surface: 'たく', type: 'desiderative' }];
  } else if (test('たい')) {
    return [{ surface: 'たい', type: 'desiderative' }];
  } else if (test('ます')) {
    return [{ surface: 'ます', type: 'polite' }];
  } else if (test('ない')) {
    return [{ surface: 'ない', type: 'negative' }];
  } else if (test('った')) {
    return [{ surface: 'た', type: 'perfective' }];
  } else if (test('んだ')) {
    return [{ surface: 'だ', type: 'perfective' }];
  } else if (test('って') || test('して') || test('いて')) {
    return [{ surface: 'て', type: 'te' }];
    // TODO: think about ないで, なくて
  } else if (test('いで') || test('んで')) {
    return [{ surface: 'で', type: 'te' }];
  } else if (test('られ')) {
    return [{ surface: 'られ', type: 'passive' }];
  } else if (test('させ')) {
    return [{ surface: 'させ', type: 'causative' }];
  } else if (test('て')) {
    return [{ surface: 'て', type: 'te' }];
  } else if (test('た')) {
    return [{ surface: 'た', type: 'perfective' }];
  } else {
    return null;
  }
}

// UniDic output
//
// 晴れます
// 晴れ: 動詞,一般,*,*,下一段-ラ行,連用形-一般,ハレル,晴れる,晴れ,ハレ,晴れる,ハレル,和,*,*,*,*,*,*,用,ハレ,ハレル,ハレ,ハレル,2,C1,M4@1,8327709692404353,30296
// ます: 助動詞,*,*,*,助動詞-マス,終止形-一般,マス,ます,ます,マス,ます,マス,和,*,*,*,*,*,*,助動,マス,マス,マス,マス,*,動詞%F4@1,*,9812325267808939,35697
//
// 喜びます
// 喜び: 動詞,一般,*,*,五段-バ行,連用形-一般,ヨロコブ,喜ぶ,喜び,ヨロコビ,喜ぶ,ヨロコブ,和,*,*,*,*,*,*,用,ヨロコビ,ヨロコブ,ヨロコビ,ヨロコブ,3,C1,*,10867031830307457,39534
// ます: 助動詞,*,*,*,助動詞-マス,終止形-一般,マス,ます,ます,マス,ます,マス,和,*,*,*,*,*,*,助動,マス,マス,マス,マス,*,動詞%F4@1,*,9812325267808939,35697
//
// 食べさせられたくなかった
// 食べ: 動詞,一般,*,*,下一段-バ行,未然形-一般,タベル,食べる,食べ,タベ,食べる,タベル,和,*,*,*,*,*,*,用,タベ,タベル,タベ,タベル,2,C1,M4@1,6220495691326017,22630
// させ: 助動詞,*,*,*,下一段-サ行,未然形-一般,サセル,させる,させ,サセ,させる,サセル,和,*,*,*,*,*,*,助動,サセ,サセル,サセ,サセル,*,動詞%F3@2,M4@1,3899160323564097,14185
// られ: 助動詞,*,*,*,助動詞-レル,連用形-一般,ラレル,られる,られ,ラレ,られる,ラレル,和,*,*,*,*,*,*,助動,ラレ,ラレル,ラレ,ラレル,*,動詞%F3@2,M4@1,10936575907209857,39787
// たく: 助動詞,*,*,*,助動詞-タイ,連用形-一般,タイ,たい,たく,タク,たい,タイ,和,*,*,*,*,*,*,助動,タク,タイ,タク,タイ,*,動詞%F4@1,*,5951673654715009,21652
// なかっ: 形容詞,非自立可能,*,*,形容詞,連用形-促音便,ナイ,無い,なかっ,ナカッ,ない,ナイ,和,*,*,*,*,*,*,相,ナカッ,ナイ,ナカッ,ナイ,1,C3,M2@2,7543208145986180,27442
// た: 助動詞,*,*,*,助動詞-タ,連体形-一般,タ,た,た,タ,た,タ,和,*,*,*,*,*,*,助動,タ,タ,タ,タ,*,動詞%F2@1,形容詞%F4@-2,*,5948916285711041,21642
//
// する
// する: 動詞,非自立可能,*,*,サ行変格,連体形-一般,スル,為る,する,スル,する,スル,和,*,*,*,*,*,*,用,スル,スル,スル,スル,0,C5,*,5370298291593921,19537
//
// できます
// でき: 助動詞,*,*,*,五段-カ行,連用形-一般,テク,てく,でき,デキ,でく,デク,和,*,*,*,*,*,*,助動,デキ,デク,デキ,デク,*,動詞%F1,*,6904950235996801,25120
// ます: 助動詞,*,*,*,助動詞-マス,終止形-一般,マス,ます,ます,マス,ます,マス,和,*,*,*,*,*,*,助動,マス,マス,マス,マス,*,動詞%F4@1,*,9812325267808939,35697
//
// します
// し: 動詞,非自立可能,*,*,サ行変格,連用形-一般,スル,為る,し,シ,する,スル,和,*,*,*,*,*,*,用,シ,スル,シ,スル,0,C5,*,5370298291593857,19537
// ます: 助動詞,*,*,*,助動詞-マス,終止形-一般,マス,ます,ます,マス,ます,マス,和,*,*,*,*,*,*,助動,マス,マス,マス,マス,*,動詞%F4@1,*,9812325267808939,35697
//
// しません
// し: 動詞,非自立可能,*,*,サ行変格,連用形-一般,スル,為る,し,シ,する,スル,和,*,*,*,*,*,*,用,シ,スル,シ,スル,0,C5,*,5370298291593857,19537
// ませ: 助動詞,*,*,*,助動詞-マス,未然形-一般,マス,ます,ませ,マセ,ます,マス,和,*,*,*,*,*,*,助動,マセ,マス,マセ,マス,*,動詞%F4@1,*,9812325267808833,35697
// ん: 助動詞,*,*,*,助動詞-ヌ,終止形-撥音便,ズ,ず,ん,ン,ぬ,ヌ,和,*,*,*,*,*,*,助動,ン,ヌ,ン,ヌ,*,動詞%F4@0,*,5384050776875693,19587
//
// 死んでた
// 死ん: 動詞,一般,*,*,五段-ナ行,連用形-撥音便,シヌ,死ぬ,死ん,シン,死ぬ,シヌ,和,*,*,*,*,*,*,用,シン,シヌ,シン,シヌ,0,C2,*,4294151319462533,15622
// で: 助詞,接続助詞,*,*,*,*,テ,て,で,デ,で,デ,和,*,*,*,*,*,*,接助,デ,デ,デ,デ,*,動詞%F1,形容詞%F2@-1,*,6837330270888448,24874
// い: 動詞,非自立可能,*,*,上一段-ア行,連用形-一般,イル,居る,い,イ,いる,イル,和,*,*,*,*,*,*,用,イ,イル,イ,イル,0,C4,M4@1,710568013079169,2585
// た: 助動詞,*,*,*,助動詞-タ,連体形-一般,タ,た,た,タ,た,タ,和,*,*,*,*,*,*,助動,タ,タ,タ,タ,*,動詞%F2@1,形容詞%F4@-2,*,5948916285711041,21642
//
// 死んでいました
// 死ん: 動詞,一般,*,*,五段-ナ行,連用形-撥音便,シヌ,死ぬ,死ん,シン,死ぬ,シヌ,和,*,*,*,*,*,*,用,シン,シヌ,シン,シヌ,0,C2,*,4294151319462533,15622
// で: 助詞,接続助詞,*,*,*,*,テ,て,で,デ,で,デ,和,*,*,*,*,*,*,接助,デ,デ,デ,デ,*,動詞%F1,形容詞%F2@-1,*,6837330270888448,24874
// い: 動詞,非自立可能,*,*,上一段-ア行,連用形-一般,イル,居る,い,イ,いる,イル,和,*,*,*,*,*,*,用,イ,イル,イ,イル,0,C4,M4@1,710568013079169,2585
// まし: 助動詞,*,*,*,助動詞-マス,連用形-一般,マス,ます,まし,マシ,ます,マス,和,*,*,*,*,*,*,助動,マシ,マス,マシ,マス,*,動詞%F4@1,*,9812325267808897,35697
// た: 助動詞,*,*,*,助動詞-タ,終止形-一般,タ,た,た,タ,た,タ,和,*,*,*,*,*,*,助動,タ,タ,タ,タ,*,動詞%F2@1,形容詞%F4@-2,*,5948916285711019,21642
//
// ありません
// あり: 動詞,非自立可能,*,*,五段-ラ行,連用形-一般,アル,有る,あり,アリ,ある,アル,和,*,*,*,*,*,*,用,アリ,アル,アリ,アル,1,C3,*,334260158472833,1216
// ませ: 助動詞,*,*,*,助動詞-マス,未然形-一般,マス,ます,ませ,マセ,ます,マス,和,*,*,*,*,*,*,助動,マセ,マス,マセ,マス,*,動詞%F4@1,*,9812325267808833,35697
// ん: 助動詞,*,*,*,助動詞-ヌ,終止形-撥音便,ズ,ず,ん,ン,ぬ,ヌ,和,*,*,*,*,*,*,助動,ン,ヌ,ン,ヌ,*,動詞%F4@0,*,5384050776875693,19587
//
// ない
// ない: 助動詞,*,*,*,助動詞-ナイ,連体形-一般,ナイ,ない,ない,ナイ,ない,ナイ,和,*,*,*,*,*,*,助動,ナイ,ナイ,ナイ,ナイ,*,動詞%F3@0,*,7542108634358465,27438
//
// 言った
// 言っ: 動詞,一般,*,*,五段-ワア行,連用形-促音便,イウ,言う,言っ,イッ,言う,イウ,和,*,*,*,*,*,*,用,イッ,イウ,イッ,イウ,0,C2,*,431841882546820,1571
// た: 助動詞,*,*,*,助動詞-タ,連体形-一般,タ,た,た,タ,た,タ,和,*,*,*,*,*,*,助動,タ,タ,タ,タ,*,動詞%F2@1,形容詞%F4@-2,*,5948916285711041,21642
//
// させる
// させる: 助動詞,*,*,*,下一段-サ行,連体形-一般,サセル,させる,させる,サセル,させる,サセル,和,*,*,*,*,*,*,助動,サセル,サセル,サセル,サセル,*,動詞%F3@2,*,3899160323564225,14185
//
// られる
// られる: 助動詞,*,*,*,助動詞-レル,連体形-一般,ラレル,られる,られる,ラレル,られる,ラレル,和,*,*,*,*,*,*,助動,ラレル,ラレル,ラレル,ラレル,*,動詞%F3@2,*,10936575907209921,39787
//
//
// IPADIC
// する
// する	動詞,自立,*,*,五段・ラ行,基本形,する,スル,スル
//
// できます
// でき	動詞,自立,*,*,一段,連用形,できる,デキ,デキ
// ます	助動詞,*,*,*,特殊・マス,基本形,ます,マス,マス
//
// します
// し	動詞,自立,*,*,サ変・スル,連用形,する,シ,シ
// ます	助動詞,*,*,*,特殊・マス,基本形,ます,マス,マス
//
// しません
// し	動詞,自立,*,*,サ変・スル,連用形,する,シ,シ
// ませ	助動詞,*,*,*,特殊・マス,未然形,ます,マセ,マセ
// ん	助動詞,*,*,*,不変化型,基本形,ん,ン,ン
//
// 食べさせられたくなかった
// 食べ	動詞,自立,*,*,一段,未然形,食べる,タベ,タベ
// させ	動詞,接尾,*,*,一段,未然形,させる,サセ,サセ
// られ	動詞,接尾,*,*,一段,連用形,られる,ラレ,ラレ
// たく	助動詞,*,*,*,特殊・タイ,連用テ接続,たい,タク,タク
// なかっ	助動詞,*,*,*,特殊・ナイ,連用タ接続,ない,ナカッ,ナカッ
// た	助動詞,*,*,*,特殊・タ,基本形,た,タ,タ
//
// 喜びます
// 喜び	動詞,自立,*,*,五段・バ行,連用形,喜ぶ,ヨロコビ,ヨロコビ
// ます	助動詞,*,*,*,特殊・マス,基本形,ます,マス,マス
//
// 晴れます
// 晴れ	動詞,自立,*,*,一段,連用形,晴れる,ハレ,ハレ
// ます	助動詞,*,*,*,特殊・マス,基本形,ます,マス,マス
//
// 死んでた
// 死ん	動詞,自立,*,*,五段・ナ行,連用タ接続,死ぬ,シン,シン
// で	動詞,非自立,*,*,一段,連用形,でる,デ,デ
// た	助動詞,*,*,*,特殊・タ,基本形,た,タ,タ
//
// 死んでいました
// 死ん	動詞,自立,*,*,五段・ナ行,連用タ接続,死ぬ,シン,シン
// で	助詞,接続助詞,*,*,*,*,で,デ,デ
// い	動詞,非自立,*,*,一段,連用形,いる,イ,イ
// まし	助動詞,*,*,*,特殊・マス,連用形,ます,マシ,マシ
// た	助動詞,*,*,*,特殊・タ,基本形,た,タ,タ
//
// ありません
// あり	動詞,自立,*,*,五段・ラ行,連用形,ある,アリ,アリ
// ませ	助動詞,*,*,*,特殊・マス,未然形,ます,マセ,マセ
// ん	助動詞,*,*,*,不変化型,基本形,ん,ン,ン
//
// ない
// ない	形容詞,自立,*,*,形容詞・アウオ段,基本形,ない,ナイ,ナイ
//
// 言った
// 言っ	動詞,自立,*,*,五段・ワ行促音便,連用タ接続,言う,イッ,イッ
// た	助動詞,*,*,*,特殊・タ,基本形,た,タ,タ
//
// させる
// さ	動詞,自立,*,*,サ変・スル,未然レル接続,する,サ,サ
// せる	動詞,接尾,*,*,一段,基本形,せる,セル,セル
//
// られる
// られる	動詞,接尾,*,*,一段,基本形,られる,ラレル,ラレル
