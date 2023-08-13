import { morae } from './helpers';
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

const aToU = 'う'.charCodeAt(0) - 'あ'.charCodeAt(0);

function shiftChar(char: VerbEnd, row: Vowel) {
  const offset = 'お'.charCodeAt(0) - row.charCodeAt(0);

  switch (char) {
    case 'う':
      return row === 'あ' ? 'わ' : null;
    case 'く':
    case 'ぐ':
    case 'す':
    case 'ず':
    case 'つ':
    case 'づ':
    case 'ぬ':
    case 'ふ':
    case 'ぶ':
    case 'ぷ':
    case 'む':
    case 'ゆ':
    case 'る':
      return String.fromCharCode(char.charCodeAt(0) - aToU + offset);
  }
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
