import { getHeadMoraPosition, morae, syllables } from './helpers';

// TODO: Create adapter for UniDic
// TODO: Support long words like:
// 教えたりしなければならない
// 食べさせられたくなかった
// TODO: See NHK for 命令形 and 可能表現

export function getPitchForInflectedWord(tokens: ConjugationToken[]) {
  const surface = tokens.map((t) => t.surface).join('');
  const allSyllables = [...syllables(surface)];
  const allMorae = allSyllables.flat(1).join('');

  const first = tokens[0];
  if (!first || !isBase(first)) {
    return null;
  }

  const [penultimate, last] = tokens.slice(-2);
  // FIXME: starting to rethink asking for part of speech, as the definition of
  // token boundaries differs between literature and IPADIC/UniDic. Also
  // inconvenient. Maybe we only need the base form? Once it starts chaining
  // into longer forms, it's all relatively predictable and pattern-friendly.
  if (penultimate && last?.type === 'other') {
    // NHK 1.1.a
    if (
      (penultimate.type === 'conjunctive' && last.surface === 'に') ||
      (penultimate.type === 'euphonic' &&
        ['た', 'て'].includes(last.surface)) ||
      // FIXME: NHK refers specifically to attributive or terminal (which are
      // identical nowadays), but MeCab UniDic does not reliably pick a
      // consistent one of the two, so sometimes we miss matches. We might as
      // well just match on either.
      (penultimate.type === 'attributive' &&
        ['だけ', 'ほど'].includes(last.surface))
    ) {
      const auxiliaryMorae = [...morae(last.surface)].length;
      return first.accent
        ? getHeadMoraPosition(-(auxiliaryMorae + 1), allSyllables) ?? 1
        : 0;
    }

    if (first.accent !== undefined) {
      // NHK 1.1.b
      if (
        (penultimate.type === 'conjunctive' && last.surface === 'は') ||
        // FIXME: NHK refers specifically to attributive or terminal (which are
        // identical nowadays), but MeCab UniDic does not reliably pick a
        // consistent one of the two, so sometimes we miss matches. We might as
        // well just match on either.
        (penultimate.type === 'terminal' &&
          [
            'が',
            'から',
            'けれど',
            'けれども', // FIXME: handle as two separate tokens: けれど・も
            'し',
            'って',
            'と', // TODO: may also be heiban
            'なら',
          ].includes(last.surface)) ||
        (penultimate.type === 'attributive' &&
          ['しか', 'のだ', 'ので', 'のに'].includes(last.surface)) ||
        (penultimate.type === 'hypothetical' && last.surface === 'ば')
      ) {
        const auxiliaryMorae = [...morae(last.surface)].length;
        return (
          getHeadMoraPosition(
            first.accent ? -(auxiliaryMorae + 1) : -auxiliaryMorae,
            allSyllables
          ) ?? 1
        );
      }

      // NHK 1.2.a
      if (
        (penultimate.type === 'terminal' &&
          // FIXME: handle as two separate tokens: そう・だ
          // FIXME: handle as two separate tokens: みたい・だ
          ['そうだ', 'みたいだ', 'らしい'].includes(last.surface)) ||
        (penultimate.type === 'attributive' &&
          [
            'ぐらい',
            'くらい',
            'どころか', // FIXME: handle as two separate particles: どころ・か
            'ばかり',
            'まで',
            'ようだ', // FIXME: handle as auxiliary + auxiliary verb: よう・だ
            'より',
          ].includes(last.surface))
      ) {
        const auxiliaryAccent = last.surface === 'らしい' ? 2 : 1;

        // TODO: Need to figure out how to represent two downsteps.
        // TODO: くらい・ぐらい and どころか also have an alternative pattern.
        return first.accent ? null : allMorae.length + auxiliaryAccent;
      }

      // NHK 1.2.b
      if (
        penultimate.type === 'terminal' &&
        ['だろう', 'でしょう'].includes(penultimate.surface)
      ) {
        // TODO: Need to figure out how to represent two downsteps.
        return null;
      }
    }
  }

  // If it's a dictionary-form verb with no downstream particles to influence
  // accent, return whatever accent the dictionary has on record.
  if (first.type === 'terminal') {
    if (tokens.length > 1) {
      // TODO: handle downstream particles.
      return null;
    }

    return first.accent ?? null;
  }

  const second = tokens[1];
  // TODO: handle second token being something else, like a particle.
  if (!second || !isAffix(second)) {
    return null;
  }

  // TODO: handle potential form, passive, causative, imperative... all the
  // forms on OJAD, really.

  const coupletSyllables = [...syllables(`${first.surface}${second.surface}`)];

  if (first.group === 'suru') {
    if (first.type === 'conjunctive') {
      if (second.type === 'polite') {
        return getHeadMoraPosition(-1, coupletSyllables) ?? 1;
      }

      return null;
    }

    if (first.type === 'volitional') {
      if (second.type === 'volitional') {
        return getHeadMoraPosition(-1, coupletSyllables) ?? 1;
      }

      return null;
    }

    if (first.type === 'irrealis') {
      if (second.type === 'negative') {
        return 0;
      }

      // causative-passive is handled the same as passive.
      // /させる (causative) 0
      // /される (passive) 0
      // /させられる (causative-passive) 0
      if (second.type === 'causative' || second.type === 'passive') {
        return 0;
      }

      return null;
    }

    if (first.type === 'euphonic') {
      if (second.type === 'perfective' || second.type === 'te') {
        return 0;
      }

      return null;
    }

    if (first.type === 'hypothetical') {
      if (second.type === 'conditional') {
        return getHeadMoraPosition(-1, coupletSyllables) ?? 1;
      }

      return null;
    }

    // TODO: dekiru

    return null;
  }

  if (first.group === 'kuru') {
    if (first.type === 'conjunctive') {
      if (second.type === 'polite') {
        return getHeadMoraPosition(-1, coupletSyllables) ?? 1;
      }

      return null;
    }

    if (first.type === 'volitional') {
      if (second.type === 'volitional') {
        return getHeadMoraPosition(-1, coupletSyllables) ?? 1;
      }

      return null;
    }

    if (first.type === 'irrealis') {
      if (second.type === 'negative') {
        return 1;
      }

      // causative-passive is handled the same as passive.
      // こさせ\る (causative)
      // こられ\る (passive)
      // こさせられ\る (causative-passive)
      if (second.type === 'causative' || second.type === 'passive') {
        return getHeadMoraPosition(-1, coupletSyllables) ?? 1;
      }

      return null;
    }

    if (first.type === 'euphonic') {
      if (second.type === 'perfective' || second.type === 'te') {
        return 1;
      }

      return null;
    }

    if (first.type === 'hypothetical') {
      if (second.type === 'conditional') {
        return getHeadMoraPosition(antepenultimateIndex, coupletSyllables) ?? 1;
      }

      return null;
    }

    return null;
  }

  if (first.group === 'ichidan' || first.group === 'godan') {
    if (first.type === 'conjunctive') {
      if (second.type === 'polite') {
        return getHeadMoraPosition(-1, coupletSyllables) ?? 1;
      }

      return null;
    }

    if (first.type === 'volitional') {
      if (second.type === 'volitional') {
        return getHeadMoraPosition(-1, coupletSyllables) ?? 1;
      }

      return null;
    }

    if (first.accent === undefined) {
      // Need accent data for the remaining cases.
      return null;
    }

    if (first.type === 'irrealis') {
      if (second.type === 'negative') {
        return first.accent
          ? getHeadMoraPosition(antepenultimateIndex, coupletSyllables) ?? 1
          : 0;
      }

      // causative-passive is handled the same as passive.
      //
      // godan (group I):
      // - accented:
      //   - passive: つくられ\る
      //   - causative: つくらせ\る
      //   - causative-passive: つくらせられ\る
      // - accentless:
      //   - passive: /あそばれる
      //   - causative: /あそばせる
      //   - causative-passive: /あそばせられる
      //
      // ichidan (group II):
      // - accented:
      //   - passive: しめられ\る
      //   - causative: しめさせ\る
      //   - causative-passive: しめさせられ\る
      // - accentless:
      //   - passive: /あけられる
      //   - causative: /あけさせる
      //   - causative-passive: /あけさせられる
      if (second.type === 'passive' || second.type === 'causative') {
        return first.accent
          ? getHeadMoraPosition(-1, coupletSyllables) ?? 1
          : 0;
      }

      return null;
    }

    if (first.type === 'euphonic') {
      // > [for godan] in the gerundive and past tense forms, no shift to the
      // > antepenultimate position occurs.
      if (second.type === 'perfective') {
        return first.accent
          ? getHeadMoraPosition(
              first.group === 'ichidan' ? antepenultimateIndex : -1,
              coupletSyllables
            ) ?? 1
          : 0;
      }

      if (second.type === 'te') {
        return first.accent
          ? getHeadMoraPosition(
              first.group === 'ichidan' ? antepenultimateIndex : -1,
              coupletSyllables
            ) ?? 1
          : 0;
      }

      return null;
    }

    if (first.type === 'hypothetical') {
      if (second.type === 'conditional') {
        return (
          getHeadMoraPosition(
            first.accent ? antepenultimateIndex : -1,
            coupletSyllables
          ) ?? 1
        );
      }

      return null;
    }

    return null;
  }

  // TODO: handle adjectives
  return null;
}

function isBase(token: ConjugationToken): token is Base {
  return baseTypes.has(token.type);
}
function isAffix(token: ConjugationToken): token is Affix {
  return affixTypes.has(token.type);
}

type ConjugationToken = Base | Affix;

const baseTypes = new Set([
  'terminal',
  'attributive',
  'hypothetical',
  'potential',
  'imperative',
  'irrealis',
  'volitional',
  'conjunctive',
  'euphonic',
]);
const affixTypes = new Set([
  'conditional',
  'potential',
  'imperative',
  'negative',
  'passive',
  'causative',
  'volitional',
  'conjunctive',
  'perfective',
  'te',
  'polite',
]);

type Base = {
  // TODO: should distinguish between surface and pronunciation. It's actually
  // pronunciation we work with, though surface may help with special-casing.
  surface: string;
  /**
   * "godan" is also known as Group I or C-final.
   * "ichidan" is also known as Group II or V-final.
   */
  group: 'godan' | 'ichidan' | 'kuru' | 'suru';
  accent?: number;
} & (
  | {
      type: 'terminal';
    }
  | {
      type: 'attributive';
    }
  | {
      type: 'hypothetical';
    }
  | {
      type: 'potential';
    }
  | {
      type: 'imperative';
    }
  | {
      type: 'irrealis';
    }
  | {
      type: 'volitional';
    }
  | {
      type: 'conjunctive';
    }
  | {
      type: 'euphonic';
    }
);

// √: rule available in Shigeto Kawahara
type Affix = { surface: string } & (
  | {
      type: 'conditional'; // √
    }
  | {
      type: 'potential';
    }
  | {
      type: 'imperative';
    }
  | {
      type: 'negative'; // √
    }
  | {
      type: 'passive';
    }
  | {
      type: 'causative';
    }
  | {
      type: 'volitional'; // √
    }
  | {
      type: 'conjunctive';
    }
  | {
      type: 'perfective'; // √
    }
  | {
      type: 'te'; // √
    }
  | {
      type: 'polite'; // √
    }
  | {
      /**
       * Things like よう, だ, らしい. Still working on these categories.
       */
      type: 'other';
    }
);

const antepenultimateIndex = -2;
