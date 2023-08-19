import { describe, expect, test } from '@jest/globals';
import { getPitchForInflectedWord } from './inflection';

describe('getPitchForInflectedWord', () => {
  describe('suru', () => {
    describe('する', () => {
      test('negative', () => {
        expect(
          getPitchForInflectedWord([
            {
              surface: 'し',
              group: 'suru',
              type: 'irrealis',
              accent: 0,
            },
            {
              surface: 'ない',
              type: 'negative',
            },
          ])
        ).toEqual(0);
      });

      test('polite', () => {
        expect(
          getPitchForInflectedWord([
            {
              surface: 'し',
              group: 'suru',
              type: 'conjunctive',
              accent: 0,
            },
            {
              surface: 'ます',
              type: 'polite',
            },
          ])
        ).toEqual(2);
      });

      test('non-past', () => {
        expect(
          getPitchForInflectedWord([
            {
              surface: 'する',
              group: 'suru',
              type: 'terminal',
              accent: 0,
            },
          ])
        ).toEqual(0);
      });

      test('gerundive', () => {
        expect(
          getPitchForInflectedWord([
            {
              surface: 'し',
              group: 'suru',
              type: 'euphonic',
              accent: 0,
            },
            {
              surface: 'て',
              type: 'te',
            },
          ])
        ).toEqual(0);
      });

      test('past', () => {
        expect(
          getPitchForInflectedWord([
            {
              surface: 'し',
              group: 'suru',
              type: 'euphonic',
              accent: 0,
            },
            {
              surface: 'た',
              type: 'perfective',
            },
          ])
        ).toEqual(0);
      });

      test('conditional', () => {
        expect(
          getPitchForInflectedWord([
            {
              surface: 'すれ',
              group: 'suru',
              type: 'hypothetical',
              accent: 0,
            },
            {
              surface: 'ば',
              type: 'conditional',
            },
          ])
        ).toEqual(2);
      });

      test('volitional', () => {
        expect(
          getPitchForInflectedWord([
            {
              surface: 'し',
              group: 'suru',
              type: 'volitional',
              accent: 0,
            },
            {
              surface: 'よう',
              type: 'volitional',
            },
          ])
        ).toEqual(2);
      });

      test('causative', () => {
        expect(
          getPitchForInflectedWord([
            {
              surface: 'さ',
              group: 'suru',
              type: 'irrealis',
              accent: 0,
            },
            {
              surface: 'せる',
              type: 'causative',
            },
          ])
        ).toEqual(0);
      });

      test('passive', () => {
        expect(
          getPitchForInflectedWord([
            {
              surface: 'さ',
              group: 'suru',
              type: 'irrealis',
              accent: 0,
            },
            {
              surface: 'れる',
              type: 'passive',
            },
          ])
        ).toEqual(0);
      });

      test('causative-passive', () => {
        expect(
          getPitchForInflectedWord([
            {
              surface: 'さ',
              group: 'suru',
              type: 'irrealis',
              accent: 0,
            },
            {
              surface: 'せられる',
              type: 'passive',
            },
          ])
        ).toEqual(0);
      });
    });
  });

  describe('kuru', () => {
    describe('来る', () => {
      test('negative', () => {
        expect(
          getPitchForInflectedWord([
            {
              surface: 'こ',
              group: 'kuru',
              type: 'irrealis',
              accent: 1,
            },
            {
              surface: 'ない',
              type: 'negative',
            },
          ])
        ).toEqual(1);
      });

      test('polite', () => {
        expect(
          getPitchForInflectedWord([
            {
              surface: 'き',
              group: 'kuru',
              type: 'conjunctive',
              accent: 1,
            },
            {
              surface: 'ます',
              type: 'polite',
            },
          ])
        ).toEqual(2);
      });

      test('non-past', () => {
        expect(
          getPitchForInflectedWord([
            {
              surface: 'くる',
              group: 'kuru',
              type: 'terminal',
              accent: 1,
            },
          ])
        ).toEqual(1);
      });

      test('gerundive', () => {
        expect(
          getPitchForInflectedWord([
            {
              surface: 'き',
              group: 'kuru',
              type: 'euphonic',
              accent: 1,
            },
            {
              surface: 'て',
              type: 'te',
            },
          ])
        ).toEqual(1);
      });

      test('past', () => {
        expect(
          getPitchForInflectedWord([
            {
              surface: 'き',
              group: 'kuru',
              type: 'euphonic',
              accent: 1,
            },
            {
              surface: 'た',
              type: 'perfective',
            },
          ])
        ).toEqual(1);
      });

      test('conditional', () => {
        expect(
          getPitchForInflectedWord([
            {
              surface: 'くれ',
              group: 'kuru',
              type: 'hypothetical',
              accent: 1,
            },
            {
              surface: 'ば',
              type: 'conditional',
            },
          ])
        ).toEqual(1);
      });

      test('volitional', () => {
        expect(
          getPitchForInflectedWord([
            {
              surface: 'こ',
              group: 'kuru',
              type: 'volitional',
              accent: 1,
            },
            {
              surface: 'よう',
              type: 'volitional',
            },
          ])
        ).toEqual(2);
      });

      test('causative', () => {
        expect(
          getPitchForInflectedWord([
            {
              surface: 'こ',
              group: 'kuru',
              type: 'irrealis',
              accent: 1,
            },
            {
              surface: 'させる',
              type: 'causative',
            },
          ])
        ).toEqual(3);
      });

      test('passive', () => {
        expect(
          getPitchForInflectedWord([
            {
              surface: 'こ',
              group: 'kuru',
              type: 'irrealis',
              accent: 1,
            },
            {
              surface: 'られる',
              type: 'passive',
            },
          ])
        ).toEqual(3);
      });

      test('causative-passive', () => {
        expect(
          getPitchForInflectedWord([
            {
              surface: 'こ',
              group: 'kuru',
              type: 'irrealis',
              accent: 1,
            },
            {
              surface: 'させられる',
              type: 'passive',
            },
          ])
        ).toEqual(5);
      });
    });
  });

  // V-final
  describe('ichidan', () => {
    describe('accented', () => {
      // nakadaka
      describe('晴れる', () => {
        test('negative', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はれ',
                group: 'ichidan',
                type: 'irrealis',
                accent: 2,
              },
              {
                surface: 'ない',
                type: 'negative',
              },
            ])
          ).toEqual(2);
        });

        test('polite', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はれ',
                group: 'ichidan',
                type: 'conjunctive',
                accent: 2,
              },
              {
                surface: 'ます',
                type: 'polite',
              },
            ])
          ).toEqual(3);
        });

        test('non-past', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はれる',
                group: 'ichidan',
                type: 'terminal',
                accent: 2,
              },
            ])
          ).toEqual(2);
        });

        test('gerundive', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はれ',
                group: 'ichidan',
                type: 'euphonic',
                accent: 2,
              },
              {
                surface: 'て',
                type: 'te',
              },
            ])
          ).toEqual(1);
        });

        test('past', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はれ',
                group: 'ichidan',
                type: 'euphonic',
                accent: 2,
              },
              {
                surface: 'た',
                type: 'perfective',
              },
            ])
          ).toEqual(1);
        });

        test('conditional', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'みれれ',
                group: 'ichidan',
                type: 'hypothetical',
                accent: 2,
              },
              {
                surface: 'ば',
                type: 'conditional',
              },
            ])
          ).toEqual(2);
        });

        test('volitional', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はれ',
                group: 'ichidan',
                type: 'volitional',
                accent: 2,
              },
              {
                surface: 'よう',
                type: 'volitional',
              },
            ])
          ).toEqual(3);
        });
      });

      // atamadaka
      describe('見る', () => {
        test('negative', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'み',
                group: 'ichidan',
                type: 'irrealis',
                accent: 1,
              },
              {
                surface: 'ない',
                type: 'negative',
              },
            ])
          ).toEqual(1);
        });

        test('polite', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'み',
                group: 'ichidan',
                type: 'conjunctive',
                accent: 1,
              },
              {
                surface: 'ます',
                type: 'polite',
              },
            ])
          ).toEqual(2);
        });

        test('non-past', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'みる',
                group: 'ichidan',
                type: 'terminal',
                accent: 1,
              },
            ])
          ).toEqual(1);
        });

        test('gerundive', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'み',
                group: 'ichidan',
                type: 'euphonic',
                accent: 1,
              },
              {
                surface: 'て',
                type: 'te',
              },
            ])
          ).toEqual(1);
        });

        test('past', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'み',
                group: 'ichidan',
                type: 'euphonic',
                accent: 1,
              },
              {
                surface: 'た',
                type: 'perfective',
              },
            ])
          ).toEqual(1);
        });

        test('conditional', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'みれ',
                group: 'ichidan',
                type: 'hypothetical',
                accent: 1,
              },
              {
                surface: 'ば',
                type: 'conditional',
              },
            ])
          ).toEqual(1);
        });

        test('volitional', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'みよ',
                group: 'ichidan',
                type: 'volitional',
                accent: 1,
              },
              {
                surface: 'う',
                type: 'volitional',
              },
            ])
          ).toEqual(2);
        });

        test('causative', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'み',
                group: 'ichidan',
                type: 'irrealis',
                accent: 1,
              },
              {
                surface: 'させる',
                type: 'causative',
              },
            ])
          ).toEqual(3);
        });

        test('passive', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'み',
                group: 'ichidan',
                type: 'irrealis',
                accent: 1,
              },
              {
                surface: 'られる',
                type: 'passive',
              },
            ])
          ).toEqual(3);
        });

        test('causative-passive', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'み',
                group: 'ichidan',
                type: 'irrealis',
                accent: 1,
              },
              {
                surface: 'させられる',
                type: 'passive',
              },
            ])
          ).toEqual(5);
        });
      });
    });

    describe('unaccented', () => {
      describe('腫れる', () => {
        test('negative', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はれ',
                group: 'ichidan',
                type: 'irrealis',
                accent: 0,
              },
              {
                surface: 'ない',
                type: 'negative',
              },
            ])
          ).toEqual(0);
        });

        test('polite', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はれ',
                group: 'ichidan',
                type: 'conjunctive',
                accent: 0,
              },
              {
                surface: 'ます',
                type: 'polite',
              },
            ])
          ).toEqual(3);
        });

        test('non-past', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はれる',
                group: 'ichidan',
                type: 'terminal',
                accent: 0,
              },
            ])
          ).toEqual(0);
        });

        test('gerundive', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はれ',
                group: 'ichidan',
                type: 'euphonic',
                accent: 0,
              },
              {
                surface: 'て',
                type: 'te',
              },
            ])
          ).toEqual(0);
        });

        test('past', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はれ',
                group: 'ichidan',
                type: 'euphonic',
                accent: 0,
              },
              {
                surface: 'た',
                type: 'perfective',
              },
            ])
          ).toEqual(0);
        });

        test('conditional', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'みれれ',
                group: 'ichidan',
                type: 'hypothetical',
                accent: 0,
              },
              {
                surface: 'ば',
                type: 'conditional',
              },
            ])
          ).toEqual(3);
        });

        test('volitional', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はれ',
                group: 'ichidan',
                type: 'volitional',
                accent: 0,
              },
              {
                surface: 'よう',
                type: 'volitional',
              },
            ])
          ).toEqual(3);
        });
      });

      describe('始める', () => {
        test('negative', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はじめ',
                group: 'ichidan',
                type: 'irrealis',
                accent: 0,
              },
              {
                surface: 'ない',
                type: 'negative',
              },
            ])
          ).toEqual(0);
        });

        test('polite', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はじめ',
                group: 'ichidan',
                type: 'conjunctive',
                accent: 0,
              },
              {
                surface: 'ます',
                type: 'polite',
              },
            ])
          ).toEqual(4);
        });

        test('non-past', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はじめる',
                group: 'ichidan',
                type: 'terminal',
                accent: 0,
              },
            ])
          ).toEqual(0);
        });

        test('gerundive', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はじめ',
                group: 'ichidan',
                type: 'euphonic',
                accent: 0,
              },
              {
                surface: 'て',
                type: 'te',
              },
            ])
          ).toEqual(0);
        });

        test('past', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はじめ',
                group: 'ichidan',
                type: 'euphonic',
                accent: 0,
              },
              {
                surface: 'た',
                type: 'perfective',
              },
            ])
          ).toEqual(0);
        });

        test('conditional', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はじめ',
                group: 'ichidan',
                type: 'hypothetical',
                accent: 0,
              },
              {
                surface: 'れば',
                type: 'conditional',
              },
            ])
          ).toEqual(4);
        });

        test('volitional', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はじめ',
                group: 'ichidan',
                type: 'volitional',
                accent: 0,
              },
              {
                surface: 'よう',
                type: 'volitional',
              },
            ])
          ).toEqual(4);
        });

        test('causative', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はじめ',
                group: 'ichidan',
                type: 'irrealis',
                accent: 0,
              },
              {
                surface: 'させる',
                type: 'causative',
              },
            ])
          ).toEqual(0);
        });

        test('passive', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はじめ',
                group: 'ichidan',
                type: 'irrealis',
                accent: 0,
              },
              {
                surface: 'られる',
                type: 'passive',
              },
            ])
          ).toEqual(0);
        });

        test('causative-passive', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はじめ',
                group: 'ichidan',
                type: 'irrealis',
                accent: 0,
              },
              {
                surface: 'させられる',
                type: 'passive',
              },
            ])
          ).toEqual(0);
        });
      });
    });
  });

  // C-final
  describe('godan', () => {
    describe('accented', () => {
      describe('喜ぶ', () => {
        test('negative', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'よろこば',
                group: 'godan',
                type: 'irrealis',
                accent: 3,
              },
              {
                surface: 'ない',
                type: 'negative',
              },
            ])
          ).toEqual(4);
        });

        test('polite', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'よろこび',
                group: 'godan',
                type: 'conjunctive',
                accent: 3,
              },
              {
                surface: 'ます',
                type: 'polite',
              },
            ])
          ).toEqual(5);
        });

        test('non-past', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'よろこぶ',
                group: 'godan',
                type: 'terminal',
                accent: 3,
              },
            ])
          ).toEqual(3);
        });

        test('gerundive', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'よろこん',
                group: 'godan',
                type: 'euphonic',
                accent: 3,
              },
              {
                surface: 'で',
                type: 'te',
              },
            ])
          ).toEqual(3);
        });

        test('past', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'よろこん',
                group: 'godan',
                type: 'euphonic',
                accent: 3,
              },
              {
                surface: 'だ',
                type: 'perfective',
              },
            ])
          ).toEqual(3);
        });

        test('conditional', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'よろこべ',
                group: 'godan',
                type: 'hypothetical',
                accent: 3,
              },
              {
                surface: 'ば',
                type: 'conditional',
              },
            ])
          ).toEqual(3);
        });

        test('volitional', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'よろこぼ',
                group: 'godan',
                type: 'volitional',
                accent: 3,
              },
              {
                surface: 'う',
                type: 'volitional',
              },
            ])
          ).toEqual(4);
        });
      });

      // nakadaka
      describe('作る', () => {
        test('negative', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'つくら',
                group: 'godan',
                type: 'irrealis',
                accent: 2,
              },
              {
                surface: 'ない',
                type: 'negative',
              },
            ])
          ).toEqual(3);
        });

        test('polite', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'つくり',
                group: 'godan',
                type: 'conjunctive',
                accent: 2,
              },
              {
                surface: 'ます',
                type: 'polite',
              },
            ])
          ).toEqual(4);
        });

        test('non-past', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'つくる',
                group: 'godan',
                type: 'terminal',
                accent: 2,
              },
            ])
          ).toEqual(2);
        });

        test('gerundive', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'つくっ',
                group: 'godan',
                type: 'euphonic',
                accent: 2,
              },
              {
                surface: 'て',
                type: 'te',
              },
            ])
          ).toEqual(2);
        });

        test('past', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'つくっ',
                group: 'godan',
                type: 'euphonic',
                accent: 2,
              },
              {
                surface: 'た',
                type: 'perfective',
              },
            ])
          ).toEqual(2);
        });

        test('conditional', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'つくれ',
                group: 'godan',
                type: 'hypothetical',
                accent: 2,
              },
              {
                surface: 'ば',
                type: 'conditional',
              },
            ])
          ).toEqual(2);
        });

        test('volitional', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'つくろ',
                group: 'godan',
                type: 'volitional',
                accent: 2,
              },
              {
                surface: 'う',
                type: 'volitional',
              },
            ])
          ).toEqual(3);
        });

        test('causative', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'つくら',
                group: 'godan',
                type: 'irrealis',
                accent: 2,
              },
              {
                surface: 'せる',
                type: 'causative',
              },
            ])
          ).toEqual(4);
        });

        test('passive', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'つくら',
                group: 'godan',
                type: 'irrealis',
                accent: 2,
              },
              {
                surface: 'れる',
                type: 'passive',
              },
            ])
          ).toEqual(4);
        });

        test('causative-passive', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'つくら',
                group: 'godan',
                type: 'irrealis',
                accent: 2,
              },
              {
                surface: 'せられる',
                type: 'passive',
              },
            ])
          ).toEqual(6);
        });
      });
    });

    describe('unaccented', () => {
      describe('働く', () => {
        test('negative', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はたらか',
                group: 'godan',
                type: 'irrealis',
                accent: 0,
              },
              {
                surface: 'ない',
                type: 'negative',
              },
            ])
          ).toEqual(0);
        });

        test('polite', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はたらき',
                group: 'godan',
                type: 'conjunctive',
                accent: 0,
              },
              {
                surface: 'ます',
                type: 'polite',
              },
            ])
          ).toEqual(5);
        });

        test('non-past', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はたらく',
                group: 'godan',
                type: 'terminal',
                accent: 0,
              },
            ])
          ).toEqual(0);
        });

        test('gerundive', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はたらい',
                group: 'godan',
                type: 'euphonic',
                accent: 0,
              },
              {
                surface: 'て',
                type: 'te',
              },
            ])
          ).toEqual(0);
        });

        test('past', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はたらい',
                group: 'godan',
                type: 'euphonic',
                accent: 0,
              },
              {
                surface: 'た',
                type: 'perfective',
              },
            ])
          ).toEqual(0);
        });

        test('conditional', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はたらけ',
                group: 'godan',
                type: 'hypothetical',
                accent: 0,
              },
              {
                surface: 'ば',
                type: 'conditional',
              },
            ])
          ).toEqual(4);
        });

        test('volitional', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'はたらこ',
                group: 'godan',
                type: 'volitional',
                accent: 0,
              },
              {
                surface: 'う',
                type: 'volitional',
              },
            ])
          ).toEqual(4);
        });
      });
      describe('言う', () => {
        test('negative', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'いわ',
                group: 'godan',
                type: 'irrealis',
                accent: 0,
              },
              {
                surface: 'ない',
                type: 'negative',
              },
            ])
          ).toEqual(0);
        });

        test('polite', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'いい',
                group: 'godan',
                type: 'conjunctive',
                accent: 0,
              },
              {
                surface: 'ます',
                type: 'polite',
              },
            ])
          ).toEqual(3);
        });

        test('non-past', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'いう',
                group: 'godan',
                type: 'terminal',
                accent: 0,
              },
            ])
          ).toEqual(0);
        });

        test('gerundive', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'いっ',
                group: 'godan',
                type: 'euphonic',
                accent: 0,
              },
              {
                surface: 'て',
                type: 'te',
              },
            ])
          ).toEqual(0);
        });

        test('past', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'いっ',
                group: 'godan',
                type: 'euphonic',
                accent: 0,
              },
              {
                surface: 'た',
                type: 'perfective',
              },
            ])
          ).toEqual(0);
        });

        test('conditional', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'いえ',
                group: 'godan',
                type: 'hypothetical',
                accent: 0,
              },
              {
                surface: 'ば',
                type: 'conditional',
              },
            ])
          ).toEqual(1);
        });

        test('volitional', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'いお',
                group: 'godan',
                type: 'volitional',
                accent: 0,
              },
              {
                surface: 'う',
                type: 'volitional',
              },
            ])
          ).toEqual(1);
        });

        test('causative', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'いわ',
                group: 'godan',
                type: 'irrealis',
                accent: 0,
              },
              {
                surface: 'せる',
                type: 'causative',
              },
            ])
          ).toEqual(0);
        });

        test('passive', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'いわ',
                group: 'godan',
                type: 'irrealis',
                accent: 0,
              },
              {
                surface: 'れる',
                type: 'passive',
              },
            ])
          ).toEqual(0);
        });

        test('causative-passive', () => {
          expect(
            getPitchForInflectedWord([
              {
                surface: 'いわ',
                group: 'godan',
                type: 'irrealis',
                accent: 0,
              },
              {
                surface: 'せられる',
                type: 'passive',
              },
            ])
          ).toEqual(0);
        });
      });
    });
  });
});

// TODO: currently we represent volitional as base + affix (like Wikipedia), but
// perhaps we should also support UniDic's take which is that volitional is
// itself a free-standing word (single-token).
