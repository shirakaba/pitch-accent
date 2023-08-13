import { getHeadMoraPosition, syllables } from './helpers';

// TODO: Create adapter for UniDic
// TODO: Support long words like:
// 教えたりしなければならない
// 食べさせられたくなかった
// TODO: See NHK for 命令形 and 可能表現

export function getPitchForInflectedWord(tokens: ConjugationToken[]) {
  const first = tokens[0];
  if (!first) {
    return null;
  }

  if (!isBase(first)) {
    return null;
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

      // TODO: passive and causative.
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

      // TODO: passive and causative.
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

      // We don't have rules for passive and causative.
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
);

const antepenultimateIndex = -2;
