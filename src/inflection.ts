import { getHeadMoraPosition, morae, syllables } from './helpers';

// TODO: Support long words like:
// 教えたりしなければならない
// 食べさせられたくなかった
// TODO: See NHK for 可能表現

export function getPitch(
  tokens: ReadonlyArray<UniDicToken>
): PitchPredictions | null {
  const surfacePron = tokens.map((t) => t.surfacePron).join('');
  const [first, ...trailing] = tokens;
  const [second, third] = trailing;
  const trailingSurface = trailing.map((token) => token.surface).join('');
  const allSyllables = [...syllables(surfacePron)];

  if (!first || !isBase(first)) {
    return null;
  }

  const [penultimate, last] = tokens.slice(-2);
  const accents = parseAccent(first.accent);

  // if (penultimate && last?.type === 'other') {
  if (penultimate && last) {
    if (first.accent !== undefined) {
      // NHK 1.1.a
      const satisfiesNHK11a =
        endsWithに(tokens) ||
        endsWithたorだ(tokens) ||
        endsWithだけorほど(tokens);

      if (satisfiesNHK11a) {
        const [_verb, [auxiliary]] = satisfiesNHK11a;
        const auxiliaryMorae = [...morae(auxiliary.surface)].length;

        return [
          {
            confidence: 'high',
            reason: 'NHK 1.1.a',
            accent: [
              isAccented(first)
                ? getHeadMoraPosition(-(auxiliaryMorae + 1), allSyllables) ?? 1
                : 0,
            ],
          },
        ];
      }

      // NHK 1.1.b
      const satisfiesNHK11b =
        endsWithは(tokens) ||
        endsWithけれども(tokens) ||
        endsWithがetc(tokens) ||
        endsWithしか(tokens) ||
        endsWithのだetc(tokens) ||
        endsWithば(tokens);

      if (satisfiesNHK11b) {
        const [_verb, auxiliaryTokens] = satisfiesNHK11b;
        const auxiliaryMorae = auxiliaryTokens.flatMap((token) => [
          ...morae(token.surface),
        ]).length;

        return [
          {
            confidence: 'high',
            reason: 'NHK 1.1.b',
            accent: [
              getHeadMoraPosition(
                isAccented(first) ? -(auxiliaryMorae + 1) : -auxiliaryMorae,
                allSyllables
              ) ?? 1,
              // We add 0 as an option for 'と', as it may also be heiban.
              ...(isAccented(first) || last.surface !== 'と' ? [] : [0]),
            ],
          },
        ];
      }

      // NHK 1.2.a
      const satisfiesNHK12a =
        endsWithそうだorみたいだ(tokens) ||
        endsWithらしい(tokens) ||
        endsWithどころか(tokens) ||
        endsWithようだ(tokens) ||
        endsWithぐらいetc(tokens);

      if (satisfiesNHK12a) {
        const [verbTokens, auxiliaryTokens] = satisfiesNHK12a;
        const verbSurface = verbTokens.map((t) => t.surface).join('');
        const auxiliarySurface = auxiliaryTokens.map((t) => t.surface).join('');
        const verbMorae = [...morae(verbSurface)].length;
        const auxiliaryAccent = auxiliarySurface === 'らしい' ? 2 : 1;
        const alsoBehavesAsUnaccented = [
          'どころか',
          'ぐらい',
          'くらい',
        ].includes(auxiliarySurface);

        const common = {
          confidence: 'high',
          reason: 'NHK 1.2.a',
        } as const;

        if (!accents) {
          // Unable to parse.
          return null;
        }

        // TODO: change this all from 1.2.b to 1.2.a
        const predictions = new Array<PitchPrediction>();
        if (isAccented(first) && alsoBehavesAsUnaccented) {
          predictions.push({
            ...common,
            accent: [verbMorae + auxiliaryAccent],
          });
        }

        for (const accent of accents) {
          if (accent) {
            predictions.push({
              ...common,
              accent: [
                // The verb's own accent...
                accent,
                // ... and also the auxiliary's own downstep.
                verbMorae + auxiliaryAccent,
              ],
              // Warning: from the limited examples, it could possibly be "one
              // head mora back from the auxiliary" instead, but I think, from
              // the explanations, it should be the verb's own accent.
            });
            continue;
          }

          predictions.push({
            ...common,
            accent: [verbMorae + auxiliaryAccent],
          });
        }

        return predictions.length ? (predictions as PitchPredictions) : null;
      }

      // NHK 1.2.b
      const satisfiesNHK12b = endsWithだろうorでしょう(tokens);
      if (satisfiesNHK12b) {
        const [verbTokens] = satisfiesNHK12b;
        const verbSurface = verbTokens.map((t) => t.surface).join('');
        const verbMorae = [...morae(verbSurface)].length;
        const verbSyllables = [...syllables(verbSurface)];
        const auxiliaryAccent = 2;

        if (!accents) {
          // Unable to parse.
          return null;
        }

        const common = {
          confidence: 'high',
          reason: 'NHK 1.2.b',
        } as const;

        const predictions = new Array<PitchPrediction>();
        for (const accent of accents) {
          if (accent) {
            predictions.push({
              ...common,
              accent: [
                // The verb's own accent...
                accent,
                // ... and also the auxiliary's own downstep.
                verbMorae + auxiliaryAccent,
              ],
            });
            continue;
          }

          predictions.push(
            {
              ...common,
              accent: [
                // The final head mora of the verb...
                getHeadMoraPosition(-0, verbSyllables) ?? 1,
                // ... and also the auxiliary's own downstep.
                verbMorae + auxiliaryAccent,
              ],
            },
            {
              ...common,
              accent: [
                // Just the auxiliary's own downstep.
                verbMorae + auxiliaryAccent,
              ],
            }
          );
        }

        return predictions.length ? (predictions as PitchPredictions) : null;
      }
    }
  }

  // If it's a dictionary-form verb with no downstream particles to influence
  // accent, return whatever accent the dictionary has on record.
  if (isTerminal(first)) {
    if (tokens.length > 1) {
      // TODO: handle downstream particles.
      return null;
    }

    const predictions = accents?.map<PitchPrediction>((accent) => ({
      confidence: 'verified',
      reason: 'Dictionary data directly available for this inflection',
      accent: [accent],
    }));
    return predictions?.length ? (predictions as PitchPredictions) : null;
  }

  // TODO: support imperative at the end of a long chain
  if (isImperative(first)) {
    if (tokens.length > 1) {
      null;
    }

    const predictions = accents?.map<PitchPrediction>((accent) => ({
      confidence: 'verified',
      reason: 'Dictionary data directly available for this inflection',
      accent: [accent],
    }));
    return predictions?.length ? (predictions as PitchPredictions) : null;
  }

  // volitional
  // Works for suru, kuru, ichidan, and godan, whether accented or not.
  if (first.cForm === '意志推量形') {
    if (tokens.length > 1) {
      // TODO: handle downstream tokens like 食べようぜ.
      return null;
    }

    return [
      {
        confidence: 'high',
        reason: 'NHK 4.1',
        // Surprisingly, volitional-form tokens do exist in UniDic, but the
        // accent listed refers to the dictionary form instead.
        accent: [getHeadMoraPosition(-1, allSyllables) ?? 1],
      },
    ];
  }

  // TODO: handle second token being something else, like a particle.
  // if (!second || !isAffix(second)) {
  if (!second) {
    return null;
  }

  const coupletSyllables = [
    ...syllables(`${first.surfacePron}${second.surfacePron}`),
  ];
  const tripletSyllables = [
    ...syllables(
      `${first.surfacePron}${second.surfacePron}${third?.surfacePron ?? ''}`
    ),
  ];

  // conjunctive
  // Works for suru, kuru, ichidan, and godan, whether accented or not.
  if (isRenyoukeiOrIdentical(first)) {
    // polite
    if (second.cType === '助動詞-マス') {
      return [
        {
          confidence: 'high',
          reason: 'NHK 4.1',
          accent: [getHeadMoraPosition(-1, coupletSyllables) ?? 1],
        },
      ];
    }

    // Fall through
  }

  // TODO: handle potential form, imperative... all the forms on OJAD, really.

  if (isSuruGroup(first)) {
    // irrealis (shi and sa)
    if (['未然形-一般', '未然形-サ'].includes(first.cForm)) {
      // negative
      if (isAttributive(second) && second.surface === 'ない') {
        return [
          {
            confidence: 'verified',
            reason: 'NHK 3.1, and manually checked across various dictionaries',
            accent: [0],
          },
        ];
      }

      // MeCab may tokenise these forms a few different ways, so easiest just to
      // check the surface.
      // TODO: support further inflections.
      //
      // causative-passive is handled the same as passive.
      // /さ・せる (causative) 0
      // /さ・れる (passive) 0
      // /さ・せ・られる (causative-passive) 0
      const trailingSurface = trailing.map((token) => token.surface).join('');
      if (['せる', 'れる', 'せられる'].includes(trailingSurface)) {
        return [
          {
            confidence: 'verified',
            reason: 'NHK 2, and manually checked across various dictionaries',
            accent: [0],
          },
        ];
      }
      return null;
    }

    // euphonic
    if (isOnbinkeiOrIdentical(first)) {
      if (
        tokens.length === 2 &&
        // shita and shite
        (endsWithたorだ(tokens) || endsWithてorで(tokens))
      ) {
        return [
          {
            confidence: 'verified',
            reason:
              'NHK 1.1a, and manually checked across various dictionaries',
            accent: [0],
          },
        ];
      }

      return null;
    }

    // hypothetical
    if (first.cForm === '仮定形-一般') {
      // conditional
      if (second.surface === 'ば' && second.pos === '助詞,接続助詞') {
        return [
          {
            confidence: 'verified',
            reason:
              'NHK 1.1b, and manually checked across various dictionaries',
            accent: [getHeadMoraPosition(-1, coupletSyllables) ?? 1],
          },
        ];
      }

      return null;
    }

    // TODO: dekiru

    return null;
  }

  if (isKuruGroup(first)) {
    // irrealis
    if (first.cForm === '未然形-一般') {
      // negative
      if (isAttributive(second) && second.surface === 'ない') {
        return [
          {
            confidence: 'verified',
            reason: 'NHK 3.1, and manually checked across various dictionaries',
            accent: [1],
          },
        ];
      }

      // causative-passive is handled the same as passive.
      // こ・させ\る (causative)
      // こ・られ\る (passive)
      // こ・させ・られ\る (causative-passive)
      // if (second.lemma === 'せる' || second.lemma === 'られる') {
      if (['させる', 'られる', 'させられる'].includes(trailingSurface)) {
        // TODO: deal with arbitrary number of tokens
        const trailingSyllables =
          trailingSurface === 'させられる'
            ? tripletSyllables
            : coupletSyllables;

        return [
          {
            confidence: 'verified',
            reason: 'NHK 2, and manually checked across various dictionaries',
            accent: [getHeadMoraPosition(-1, trailingSyllables) ?? 1],
          },
        ];
      }

      return null;
    }

    // euphonic
    if (isOnbinkeiOrIdentical(first)) {
      if (
        tokens.length === 2 &&
        // kita and kite
        (endsWithたorだ(tokens) || endsWithてorで(tokens))
      ) {
        return [
          {
            confidence: 'verified',
            reason:
              'NHK 1.1a, and manually checked across various dictionaries',
            accent: [1],
          },
        ];
      }

      return null;
    }

    // hypothetical
    if (first.cForm === '仮定形-一般') {
      // conditional
      if (second.surface === 'ば' && second.pos === '助詞,接続助詞') {
        return [
          {
            confidence: 'verified',
            reason:
              'NHK 1.1b, and manually checked across various dictionaries',
            accent: [
              getHeadMoraPosition(antepenultimateIndex, coupletSyllables) ?? 1,
            ],
          },
        ];
      }

      return null;
    }

    return null;
  }

  if (isIchidan(first) || isGodan(first)) {
    if (first.accent === undefined) {
      // Need accent data for the remaining cases.
      return null;
    }

    // irrealis
    if (first.cForm === '未然形-一般') {
      // negative
      if (isAttributive(second) && second.surface === 'ない') {
        const predictions = accents?.map<PitchPrediction>((accent) => ({
          confidence: 'high',
          reason: 'NHK 3.1',
          accent: [
            accent
              ? getHeadMoraPosition(antepenultimateIndex, coupletSyllables) ?? 1
              : 0,
          ],
        }));
        return predictions?.length ? (predictions as PitchPredictions) : null;
      }

      // causative-passive is handled the same as passive.
      //
      // godan (group I):
      // - accented:
      //   - passive: つくら・れ\る
      //   - causative: つくら・せ\る
      //   - causative-passive: つくら・せ・られ\る
      // - accentless:
      //   - passive: /あそば・れる
      //   - causative: /あそば・せる
      //   - causative-passive: /あそば・せ・られる
      //
      // ichidan (group II):
      // - accented:
      //   - passive: しめ・られ\る
      //   - causative: しめ・させ\る
      //   - causative-passive: しめ・させ・られ\る
      // - accentless:
      //   - passive: /あけ・られる
      //   - causative: /あけ・させる
      //   - causative-passive: /あけ・させ・られる
      //
      // Verbs in られる, させる, or させられる forms are ichidan verbs.

      // 〜（さ）せ…
      if (isCausative(second)) {
        // 〜（さ）せる
        if (tokens.length === 2) {
          const predictions = accents?.map<PitchPrediction>((accent) => ({
            confidence: 'high',
            reason: '?',
            accent: [accent ? getHeadMoraPosition(-1, allSyllables) ?? 1 : 0],
          }));
          return predictions?.length ? (predictions as PitchPredictions) : null;
        }

        // 〜（さ）せ・られ…
        if (third && isPassive(third)) {
          // 〜（さ）せ・られる
          if (tokens.length === 3) {
            const predictions = accents?.map<PitchPrediction>((accent) => ({
              confidence: 'high',
              reason: '?',
              accent: [accent ? getHeadMoraPosition(-1, allSyllables) ?? 1 : 0],
            }));
            return predictions?.length
              ? (predictions as PitchPredictions)
              : null;
          }

          // 〜（さ）せ・（ら）れ・【ない・た・て・ます・ろ…】
          const nextTokens = [
            agglutinatePassive(agglutinateCausative(first, second), third),
            ...tokens.slice(3),
          ];
          return getPitch(nextTokens);
        }

        // Rule based on examining examples in OJAD suffix search.
        // 〜（さ）せ・【ない・た・て・ます・ろ…】
        const nextTokens = [
          agglutinateCausative(first, second),
          ...tokens.slice(2),
        ];
        return getPitch(nextTokens);
      }

      // 〜（ら）れ…
      if (isPassive(second)) {
        if (tokens.length === 2) {
          // 〜（ら）れる
          const predictions = accents?.map<PitchPrediction>((accent) => ({
            confidence: 'high',
            reason: '?',
            accent: [accent ? getHeadMoraPosition(-1, allSyllables) ?? 1 : 0],
          }));
          return predictions?.length ? (predictions as PitchPredictions) : null;
        }

        // 〜（ら）れ・【ない・た・て・ます・ろ…】
        const nextTokens = [
          agglutinatePassive(first, second),
          ...tokens.slice(2),
        ];
        return getPitch(nextTokens);
      }

      return null;
    }

    // euphonic
    if (isOnbinkeiOrIdentical(first)) {
      if (tokens.length !== 2) {
        // TODO: support more tokens
        return null;
      }

      // > [for godan] in the gerundive and past tense forms, no shift to the
      // > antepenultimate position occurs.

      // perfective
      if (endsWithたorだ(tokens)) {
        const predictions = accents?.map<PitchPrediction>((accent) => ({
          confidence: 'high',
          reason: '?',
          accent: [
            accent
              ? getHeadMoraPosition(
                  isIchidan(first) ? antepenultimateIndex : -1,
                  coupletSyllables
                ) ?? 1
              : 0,
          ],
        }));
        return predictions?.length ? (predictions as PitchPredictions) : null;
      }

      // gerundive (te form)
      if (endsWithてorで(tokens)) {
        const predictions = accents?.map<PitchPrediction>((accent) => ({
          confidence: 'high',
          reason: '?',
          accent: [
            accent
              ? getHeadMoraPosition(
                  isIchidan(first) ? antepenultimateIndex : -1,
                  coupletSyllables
                ) ?? 1
              : 0,
          ],
        }));
        return predictions?.length ? (predictions as PitchPredictions) : null;
      }

      return null;
    }

    // hypothetical
    if (first.cForm === '仮定形-一般') {
      // conditional
      if (second.surface === 'ば' && second.pos === '助詞,接続助詞') {
        const predictions = accents?.map<PitchPrediction>((accent) => ({
          confidence: 'high',
          reason: '?',
          accent: [
            getHeadMoraPosition(
              accent ? antepenultimateIndex : -1,
              coupletSyllables
            ) ?? 1,
          ],
        }));
        return predictions?.length ? (predictions as PitchPredictions) : null;
      }

      return null;
    }

    return null;
  }

  // TODO: handle adjectives
  return null;
}

function isBase(token: UniDicToken): token is Base {
  return (
    token.pos === '動詞,非自立可能,*,*' ||
    token.pos === '動詞,一般,*,*' ||
    token.pos === '形容詞,一般,*,*'
  );
}

export function isIchidan(token: UniDicToken) {
  return token.cType.includes('一段');
}
export function isGodan(token: UniDicToken) {
  return token.cType.includes('五段');
}
export function isSuruGroup(token: UniDicToken) {
  return token.cType === 'サ行変格';
}
export function isKuruGroup(token: UniDicToken) {
  return token.cType === 'カ行変格';
}
export function getGroup(token: UniDicToken) {
  if (isSuruGroup(token)) {
    return 'suru';
  }
  if (isKuruGroup(token)) {
    return 'kuru';
  }
  if (isGodan(token)) {
    return 'godan';
  }
  if (isIchidan(token)) {
    return 'ichidan';
  }

  // May not be a verb at all. Or may not be a known verb.
  return null;
}
function isAccented(token: UniDicToken) {
  if (token.accent === undefined) {
    throw new Error('Expected accent to be defined');
  }

  const accents = parseAccent(token.accent);
  if (!accents) {
    return false;
  }

  return accents.some((accent) => accent > 0);
}
export function parseAccent(accent: string) {
  const accents = accent
    .split(',')
    .map((value) => parseInt(value))
    .filter((value) => !isNaN(value));

  return accents.length ? (accents as [number, ...number[]]) : null;
}

/**
 * We match both 'attributive' and 'terminal' as they're identical and MeCab
 * often chooses the wrong one.
 */
function isTerminal(token: UniDicToken) {
  return ['終止形-一般', '連体形-一般'].includes(token.cForm);
}

function isImperative(token: UniDicToken) {
  return token.cForm === '命令形';
}

/**
 * We match both 'attributive' and 'terminal' as they're identical and MeCab
 * often chooses the wrong one.
 */
function isAttributive(token: UniDicToken) {
  return isTerminal(token);
}

/**
 * We match both 'euphonic' and 'conjunctive' in non-godan verbs as they're
 * identical and MeCab often chooses the wrong one.
 */
function isOnbinkeiOrIdentical(token: UniDicToken) {
  if (token.cForm === '連用形-撥音便') {
    return true;
  }

  return isGodan(token)
    ? ['連用形-促音便', '連用形-イ音便'].includes(token.cForm)
    : token.cForm === '連用形-一般';
}

/**
 * We match both 'euphonic' and 'conjunctive' in non-godan verbs as they're
 * identical and MeCab often chooses the wrong one.
 */
function isRenyoukeiOrIdentical(token: UniDicToken) {
  return isGodan(token)
    ? token.cForm === '連用形-一般'
    : ['連用形-撥音便', '連用形-一般'].includes(token.cForm);
}

function isCausative(token: UniDicToken) {
  return (
    ['せる', 'させる'].includes(token.lemma) && token.pos === '助動詞,*,*,*'
  );
}
function isPassive(token: UniDicToken) {
  return (
    ['れる', 'られる'].includes(token.lemma) && token.pos === '助動詞,*,*,*'
  );
}

export function parseToUniDicToken(str: string): UniDicToken {
  const [
    surface,
    pos1,
    pos2,
    pos3,
    pos4,
    cType,
    cForm,
    _lForm,
    lemma,
    _orth,
    pron,
    _orthBase,
    _pronBase,
    _goshu,
    _iType,
    _iForm,
    _fType,
    _fForm,
    _iConType,
    _fConType,
    _type,
    _kana,
    _kanaBase,
    _form,
    _formBase,
    aType,
    _aConType,
    _aModType,
    _weight4,
    _weight5,
  ] = str.split(',');

  return {
    surface,
    pos: [pos1, pos2, pos3, pos4].join(','),
    pos1,
    pos2,
    pos3,
    pos4,
    cType,
    cForm,
    surfacePron: pron,
    lemma,
    accent: aType,
  };
}

export interface UniDicToken {
  surface: string;
  pos: string;
  pos1: string;
  pos2: string;
  pos3: string;
  pos4: string;
  cType: string;
  cForm: string;
  surfacePron: string;
  /**
   * @example
   * "為る"
   * "*"
   */
  lemma: string;
  /**
   * @example
   * "2"
   * "2,3"
   * "*"
   */
  accent: string;
  /**
   * Mainly for use by the library itself rather than end-users. Sometimes we
   * find it convenient to agglutinate tokens so that we can recurse and re-use
   * existing rules, as we do with passive and causative.
   */
  agglutinatedFrom?: UniDicToken[];
}

interface UniDicTokenVerb extends UniDicToken {
  pos1: '動詞';
  pos2: '一般';
  pos3: '*';
  pos4: '*';
}

interface UniDicTokenAdjectiveI extends UniDicToken {
  pos1: '形容詞';
  pos2: '一般';
  pos3: '*';
  pos4: '*';
}

interface UniDicTokenAdjectiveNa extends UniDicToken {
  pos1: '形状詞';
  pos2: '一般';
  pos3: '*';
  pos4: '*';
}

function endsWithに(tokens: ReadonlyArray<UniDicToken>) {
  const [penultimate, last] = tokens.slice(-2);
  if (!penultimate || !last) {
    return null;
  }

  return (
    // Requiring 動詞,一般,*,* would disqualify した (動詞,非自立可能,*,*)
    // first.pos === '動詞,一般,*,*' &&
    isRenyoukeiOrIdentical(penultimate) &&
      last.surface === 'に' &&
      last.pos === '助詞,格助詞,*,*'
      ? partitionFromEnd(tokens, -1)
      : null
  );
}

function endsWithたorだ(tokens: ReadonlyArray<UniDicToken>) {
  if (tokens.length !== 2) {
    // We have other rules for longer words involving katta and nakatta.
    // TODO: check whether ~ta applies for ~sareta, ~rareta.
    return null;
  }

  const [first, second] = tokens.slice(0, 2);
  if (!first || !second) {
    return null;
  }

  return (
    // Requiring 動詞,一般,*,* would disqualify した (動詞,非自立可能,*,*)
    // first.pos === '動詞,一般,*,*' &&
    isOnbinkeiOrIdentical(first) &&
      ['た', 'だ'].includes(second.surface) &&
      second.pos === '助動詞,*,*,*'
      ? partitionFromEnd(tokens, -1)
      : null
  );
}

function endsWithてorで(tokens: ReadonlyArray<UniDicToken>) {
  if (tokens.length !== 2) {
    // We have other rules for longer words involving kute.
    // TODO: check whether ~ta applies for ~sarete, ~rarete.
    return null;
  }

  const [first, second] = tokens.slice(0, 2);
  if (!first || !second) {
    return null;
  }

  return isOnbinkeiOrIdentical(first) &&
    ['て', 'で'].includes(second.surface) &&
    second.pos === '助詞,接続助詞,*,*'
    ? partitionFromEnd(tokens, -1)
    : null;
}

function endsWithだけorほど(tokens: ReadonlyArray<UniDicToken>) {
  const [penultimate, last] = tokens.slice(-2);
  if (!penultimate || !last) {
    return null;
  }

  return isAttributive(penultimate) &&
    ['だけ', 'ほど'].includes(last.surface) &&
    last.pos === '助詞,副助詞,*,*'
    ? partitionFromEnd(tokens, -1)
    : null;
}

function endsWithは(tokens: ReadonlyArray<UniDicToken>) {
  const [penultimate, last] = tokens.slice(-2);
  if (!penultimate || !last) {
    return null;
  }

  return isRenyoukeiOrIdentical(penultimate) &&
    last.surface === 'は' &&
    last.pos === '助詞,係助詞,*,*'
    ? partitionFromEnd(tokens, -1)
    : null;
}

function endsWithけれども(tokens: ReadonlyArray<UniDicToken>) {
  const [terminus, keredo, mo] = tokens.slice(-3);
  if (!terminus || !keredo || !mo) {
    return null;
  }

  return isTerminal(terminus) &&
    keredo.surface === 'けれど' &&
    keredo.pos === '助詞,接続助詞,*,*' &&
    mo.surface === 'も' &&
    mo.pos === '助詞,係助詞,*,*'
    ? partitionFromEnd(tokens, -2)
    : null;
}

function endsWithがetc(tokens: ReadonlyArray<UniDicToken>) {
  const [penultimate, last] = tokens.slice(-2);
  if (!penultimate || !last) {
    return null;
  }

  return isTerminal(penultimate) &&
    ['が', 'から', 'けれど', 'し', 'って', 'と', 'なら'].includes(last.surface)
    ? // TODO: figure out pos. It varies between って and けれど.
      // && last.pos === '助詞,接続助詞,*,*'
      partitionFromEnd(tokens, -1)
    : null;
}

function endsWithしか(tokens: ReadonlyArray<UniDicToken>) {
  const [penultimate, last] = tokens.slice(-2);
  if (!penultimate || !last) {
    return null;
  }

  return isAttributive(penultimate) &&
    last.surface === 'しか' &&
    last.pos === '助詞,副助詞,*,*'
    ? partitionFromEnd(tokens, -1)
    : null;
}

function endsWithのだetc(tokens: ReadonlyArray<UniDicToken>) {
  const [terminus, no, final] = tokens.slice(-3);
  if (!terminus || !no || !final) {
    return null;
  }

  return isAttributive(terminus) &&
    no.surface === 'の' &&
    no.pos === '助詞,準体助詞,*,*' &&
    ((['だ', 'で'].includes(final.surface) && final.pos === '助動詞,*,*,*') ||
      (final.surface === 'に' && final.pos === '助詞,格助詞,*,*'))
    ? partitionFromEnd(tokens, -2)
    : null;
}

function endsWithば(tokens: ReadonlyArray<UniDicToken>) {
  const [penultimate, last] = tokens.slice(-2);
  if (!penultimate || !last) {
    return null;
  }

  return penultimate.cForm === '仮定形-一般' &&
    last.surface === 'ば' &&
    last.pos === '助詞,接続助詞,*,*'
    ? partitionFromEnd(tokens, -1)
    : null;
}

function endsWithそうだorみたいだ(tokens: ReadonlyArray<UniDicToken>) {
  const [terminus, penultimate, da] = tokens.slice(-3);
  if (!terminus || !penultimate || !da) {
    return null;
  }

  return isTerminal(terminus) &&
    ((penultimate.surface === 'そう' &&
      penultimate.pos === '名詞,助動詞語幹,*,*') ||
      (penultimate.surface === 'みたい' &&
        penultimate.pos === '形状詞,助動詞語幹,*,*')) &&
    da.surface === 'だ' &&
    da.pos === '助動詞,*,*,*'
    ? partitionFromEnd(tokens, -2)
    : null;
}

function endsWithらしい(tokens: ReadonlyArray<UniDicToken>) {
  const [penultimate, last] = tokens.slice(-2);
  if (!penultimate || !last) {
    return null;
  }

  return isTerminal(penultimate) &&
    last.surface === 'らしい' &&
    last.pos === '接尾辞,形容詞的,*,*'
    ? partitionFromEnd(tokens, -1)
    : null;
}

function endsWithどころか(tokens: ReadonlyArray<UniDicToken>) {
  const [terminus, dokoro, ka] = tokens.slice(-3);
  if (!terminus || !dokoro || !ka) {
    return null;
  }

  return isAttributive(terminus) &&
    dokoro.surface === 'どころ' &&
    dokoro.pos === '助詞,副助詞,*,*' &&
    ka.surface === 'か' &&
    ka.pos === '助詞,副助詞,*,*'
    ? partitionFromEnd(tokens, -2)
    : null;
}

function endsWithようだ(tokens: ReadonlyArray<UniDicToken>) {
  const [terminus, penultimate, da] = tokens.slice(-3);
  if (!terminus || !penultimate || !da) {
    return null;
  }

  return isAttributive(terminus) &&
    penultimate.surface === 'よう' &&
    penultimate.pos === '形状詞,助動詞語幹,*,*' &&
    da.surface === 'だ' &&
    da.pos === '助動詞,*,*,*'
    ? partitionFromEnd(tokens, -2)
    : null;
}

function endsWithぐらいetc(tokens: ReadonlyArray<UniDicToken>) {
  const [penultimate, last] = tokens.slice(-2);
  if (!penultimate || !last) {
    return null;
  }

  return isAttributive(penultimate) &&
    ((['ぐらい', 'くらい', 'ばかり', 'まで'].includes(last.surface) &&
      last.pos === '助詞,副助詞,*,*') ||
      (last.surface === 'より' && last.pos === '助詞,格助詞,*,*'))
    ? partitionFromEnd(tokens, -1)
    : null;
}

function endsWithだろうorでしょう(tokens: ReadonlyArray<UniDicToken>) {
  const [penultimate, last] = tokens.slice(-2);
  if (!penultimate || !last) {
    return null;
  }

  return isTerminal(penultimate) &&
    ['だろう', 'でしょう'].includes(last.surface) &&
    last.pos === '助動詞,*,*,*'
    ? partitionFromEnd(tokens, -1)
    : null;
}

function partitionFromEnd<T, N extends number>(
  array: ReadonlyArray<T>,
  end: N
) {
  if (end >= 0) {
    throw new Error('Expected partition to be a number below zero.');
  }

  return [array.slice(0, end), array.slice(end)] as [
    start: T[],
    end: N extends -1
      ? [T]
      : N extends -2
      ? [T, T]
      : N extends -3
      ? [T, T, T]
      : N extends -4
      ? [T, T, T, T]
      : N extends -5
      ? [T, T, T, T, T]
      : N extends -6
      ? [T, T, T, T, T, T]
      : N extends -7
      ? [T, T, T, T, T, T, T]
      : N extends -8
      ? [T, T, T, T, T, T, T, T]
      : N extends -9
      ? [T, T, T, T, T, T, T, T, T]
      : T[],
  ];
}

function agglutinateCausative(
  base: UniDicToken,
  causativeBase: UniDicToken
): UniDicToken {
  const lemma = `${base.surface}${causativeBase.lemma}`;
  const lemmaSyllables = [...syllables(lemma)];
  return {
    surface: `${base.surface}${causativeBase.surface}`,
    pos: base.pos,
    pos1: base.pos1,
    pos2: base.pos2,
    pos3: base.pos3,
    pos4: base.pos4,
    // e.g. 見せる
    // See:
    // https://ja.wikipedia.org/wiki/下一段活用
    // https://gist.github.com/fasiha/dd5eb7942c79571dd5895e05f27e8bb9
    cType: '下一段-サ行',
    cForm: causativeBase.cForm,
    surfacePron: `${base.surfacePron}${causativeBase.surfacePron}`,
    lemma,
    accent:
      base.accent === undefined
        ? '*'
        : (isAccented(base)
            ? getHeadMoraPosition(-1, lemmaSyllables) ?? 1
            : 0
          ).toString(),
    // TODO: track down any exceptions
    agglutinatedFrom: [base, causativeBase],
  };
}

function agglutinatePassive(
  base: UniDicToken,
  passiveBase: UniDicToken
): UniDicToken {
  return {
    ...agglutinateCausative(base, passiveBase),
    // e.g. 生まれる
    cType: '下一段-ラ行',
  };
}

type Base = UniDicTokenVerb | UniDicTokenAdjectiveI | UniDicTokenAdjectiveNa;

const antepenultimateIndex = -2;

type PitchPrediction = {
  confidence: 'speculative' | 'high' | 'verified';
  accent: [number, ...number[]];
  reason: string;
};
type PitchPredictions = [PitchPrediction, ...PitchPrediction[]];
