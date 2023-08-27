import { describe, expect, test } from '@jest/globals';
import { getPitch } from './inflection';
import { unidicData } from './unidic-data';

describe('getPitch', () => {
  describe('suru', () => {
    describe('する', () => {
      test('negative', () => {
        expect(getPitch(unidicData.suru.shinai)).toMatchObject(just(0));
      });

      test('polite', () => {
        expect(getPitch(unidicData.suru.shimasu)).toMatchObject(just(2));
      });

      test('non-past', () => {
        expect(getPitch(unidicData.suru.suru)).toMatchObject(just(0));
      });

      test('gerundive', () => {
        expect(getPitch(unidicData.suru.shite)).toMatchObject(just(0));
      });

      test('past', () => {
        expect(getPitch(unidicData.suru.shita)).toMatchObject(just(0));
      });

      test('conditional', () => {
        expect(getPitch(unidicData.suru.sureba)).toMatchObject(just(2));
      });

      test('volitional', () => {
        expect(getPitch(unidicData.suru.shiyou)).toMatchObject(just(2));
      });

      test('causative', () => {
        expect(getPitch(unidicData.suru.saseru)).toMatchObject(just(0));
      });

      test('passive', () => {
        expect(getPitch(unidicData.suru.sareru)).toMatchObject(just(0));
      });

      test('CP', () => {
        expect(getPitch(unidicData.suru.saserareru)).toMatchObject(just(0));
      });

      test('imperative', () => {
        expect(getPitch(unidicData.suru.shiro)).toMatchObject(just(0));
      });
    });
  });

  describe('kuru', () => {
    describe('来る', () => {
      test('negative', () => {
        expect(getPitch(unidicData.kuru.konai)).toMatchObject(just(1));
      });

      test('polite', () => {
        expect(getPitch(unidicData.kuru.kimasu)).toMatchObject(just(2));
      });

      test('non-past', () => {
        expect(getPitch(unidicData.kuru.kuru)).toMatchObject(just(1));
      });

      test('gerundive', () => {
        expect(getPitch(unidicData.kuru.kite)).toMatchObject(just(1));
      });

      test('past', () => {
        expect(getPitch(unidicData.kuru.kita)).toMatchObject(just(1));
      });

      test('conditional', () => {
        expect(getPitch(unidicData.kuru.kureba)).toMatchObject(just(1));
      });

      test('volitional', () => {
        expect(getPitch(unidicData.kuru.koyou)).toMatchObject(just(2));
      });

      test('causative', () => {
        expect(getPitch(unidicData.kuru.kosaseru)).toMatchObject(just(3));
      });

      test('passive', () => {
        expect(getPitch(unidicData.kuru.korareru)).toMatchObject(just(3));
      });

      test('CP', () => {
        expect(getPitch(unidicData.kuru.kosaserareru)).toMatchObject(just(5));
      });

      test('imperative', () => {
        expect(getPitch(unidicData.kuru.koi)).toMatchObject(just(1));
      });
    });
  });

  // V-final
  describe('ichidan', () => {
    describe('accented', () => {
      // nakadaka
      describe('晴れる', () => {
        const hareru = unidicData.ichidan.accented.hareru;

        test('negative', () => {
          expect(getPitch(hareru.harenai)).toMatchObject(just(2));
        });

        test('polite', () => {
          expect(getPitch(hareru.haremasu)).toMatchObject(just(3));
        });

        test('non-past', () => {
          expect(getPitch(hareru.hareru)).toMatchObject(just(2));
        });

        test('gerundive', () => {
          expect(getPitch(hareru.harete)).toMatchObject(just(1));
        });

        test('past', () => {
          expect(getPitch(hareru.hareta)).toMatchObject(just(1));
        });

        test('conditional', () => {
          expect(getPitch(hareru.harereba)).toMatchObject(just(2));
        });

        test('volitional', () => {
          expect(getPitch(hareru.hareyou)).toMatchObject(just(3));
        });
      });

      // atamadaka
      describe('見る', () => {
        const miru = unidicData.ichidan.accented.miru;
        test('negative', () => {
          expect(getPitch(miru.minai)).toMatchObject(just(1));
        });

        test('polite', () => {
          expect(getPitch(miru.mimasu)).toMatchObject(just(2));
        });

        test('non-past', () => {
          expect(getPitch(miru.miru)).toMatchObject(just(1));
        });

        test('gerundive', () => {
          expect(getPitch(miru.mite)).toMatchObject(just(1));
        });

        test('past', () => {
          expect(getPitch(miru.mita)).toMatchObject(just(1));
        });

        test('conditional', () => {
          expect(getPitch(miru.mireba)).toMatchObject(just(1));
        });

        test('volitional', () => {
          expect(getPitch(miru.miyou)).toMatchObject(just(2));
        });

        describe('causative', () => {
          test('non-past', () => {
            expect(getPitch(miru.misaseru)).toMatchObject(just(3));
          });

          test('negative', () => {
            expect(getPitch(miru.misasenai)).toMatchObject(just(3));
          });

          test('polite', () => {
            // TODO: substantiate
            expect(getPitch(miru.misasemasu)).toMatchObject(just(4));
          });
        });

        test('passive', () => {
          expect(getPitch(miru.mirareru)).toMatchObject(just(3));
        });

        describe('CP', () => {
          test('non-past', () => {
            expect(getPitch(miru.misaserareru)).toMatchObject(just(5));
          });
        });

        describe('accentless auxiliaries', () => {
          describe('simple', () => {
            test('〜に', () => {
              expect(getPitch(miru.mini)).toMatchObject(just(1));
            });
            // TODO: this is simply the past tense again; decide how to refactor
            test('〜た', () => {
              expect(getPitch(miru.mita)).toMatchObject(just(1));
            });
          });
        });

        test('imperative', () => {
          expect(getPitch(miru.miro)).toMatchObject(just(1));
        });
      });
    });

    describe('unaccented', () => {
      const hareru = unidicData.ichidan.unaccented.hareru;

      describe('腫れる', () => {
        test('negative', () => {
          expect(getPitch(hareru.harenai)).toMatchObject(just(0));
        });

        test('polite', () => {
          expect(getPitch(hareru.haremasu)).toMatchObject(just(3));
        });

        test('non-past', () => {
          expect(getPitch(hareru.hareru)).toMatchObject(just(0));
        });

        test('gerundive', () => {
          expect(getPitch(hareru.harete)).toMatchObject(just(0));
        });

        test('past', () => {
          expect(getPitch(hareru.hareta)).toMatchObject(just(0));
        });

        test('conditional', () => {
          expect(getPitch(hareru.harereba)).toMatchObject(just(3));
        });

        test('volitional', () => {
          expect(getPitch(hareru.hareyou)).toMatchObject(just(3));
        });

        // Warning! Passive of "to become swollen" doesn't really make any sense
        describe('passive', () => {
          test('negative', () => {
            expect(getPitch(hareru.harerarenai)).toMatchObject(just(0));
          });

          test('non-past', () => {
            expect(getPitch(hareru.harerareru)).toMatchObject(just(0));
          });

          test('gerundive', () => {
            expect(getPitch(hareru.harerarete)).toMatchObject(just(0));
          });

          test('past', () => {
            expect(getPitch(hareru.harerareta)).toMatchObject(just(0));
          });
        });

        describe('causative', () => {
          test('negative', () => {
            expect(getPitch(hareru.haresasenai)).toMatchObject(just(0));
          });

          test('non-past', () => {
            expect(getPitch(hareru.haresaseru)).toMatchObject(just(0));
          });

          test('gerundive', () => {
            expect(getPitch(hareru.haresasete)).toMatchObject(just(0));
          });

          test('past', () => {
            expect(getPitch(hareru.haresaseta)).toMatchObject(just(0));
          });

          describe('CP', () => {
            test('negative', () => {
              expect(getPitch(hareru.haresaserarenai)).toMatchObject(just(0));
            });

            test('non-past', () => {
              expect(getPitch(hareru.haresaserareru)).toMatchObject(just(0));
            });

            test('gerundive', () => {
              expect(getPitch(hareru.haresaserarete)).toMatchObject(just(0));
            });

            test('past', () => {
              expect(getPitch(hareru.haresaserareta)).toMatchObject(just(0));
            });
          });
        });
      });

      describe('始める', () => {
        const hajimeru = unidicData.ichidan.unaccented.hajimeru;
        test('negative', () => {
          expect(getPitch(hajimeru.hajimenai)).toMatchObject(just(0));
        });

        test('polite', () => {
          expect(getPitch(hajimeru.hajimemasu)).toMatchObject(just(4));
        });

        test('non-past', () => {
          expect(getPitch(hajimeru.hajimeru)).toMatchObject(just(0));
        });

        test('gerundive', () => {
          expect(getPitch(hajimeru.hajimete)).toMatchObject(just(0));
        });

        test('past', () => {
          expect(getPitch(hajimeru.hajimeta)).toMatchObject(just(0));
        });

        test('conditional', () => {
          expect(getPitch(hajimeru.hajimereba)).toMatchObject(just(4));
        });

        test('volitional', () => {
          expect(getPitch(hajimeru.hajimeyou)).toMatchObject(just(4));
        });

        test('causative', () => {
          expect(getPitch(hajimeru.hajimesaseru)).toMatchObject(just(0));
        });

        test('passive', () => {
          expect(getPitch(hajimeru.hajimerareru)).toMatchObject(just(0));
        });

        test('CP', () => {
          expect(getPitch(hajimeru.hajimesaserareru)).toMatchObject(just(0));
        });

        test('imperative', () => {
          expect(getPitch(hajimeru.hajimero)).toMatchObject(just(0));
        });
      });
    });
  });

  // C-final
  describe('godan', () => {
    describe('accented', () => {
      describe('書く', () => {
        const kaku = unidicData.godan.accented.kaku;

        test('negative', () => {
          expect(getPitch(kaku.kakanai)).toMatchObject(just(2));
        });

        test('polite', () => {
          expect(getPitch(kaku.kakimasu)).toMatchObject(just(3));
        });

        test('non-past', () => {
          expect(getPitch(kaku.kaku)).toMatchObject(just(1));
        });

        test('gerundive', () => {
          expect(getPitch(kaku.kaite)).toMatchObject(just(1));
        });

        test('past', () => {
          expect(getPitch(kaku.kaita)).toMatchObject(just(1));
        });

        test('conditional', () => {
          expect(getPitch(kaku.kakeba)).toMatchObject(just(1));
        });

        test('volitional', () => {
          expect(getPitch(kaku.kakou)).toMatchObject(just(2));
        });

        describe('causative', () => {
          test('non-past', () => {
            expect(getPitch(kaku.kakaseru)).toMatchObject(just(3));
          });

          test('negative', () => {
            expect(getPitch(kaku.kakasenai)).toMatchObject(just(3));
          });

          // test('polite', () => {
          //   // TODO: substantiate
          //   expect(getPitch(kaku.kakasemasu)).toMatchObject(just(4));
          // });

          test('gerundive', () => {
            expect(getPitch(kaku.kakasete)).toMatchObject(just(2));
          });

          test('past', () => {
            expect(getPitch(kaku.kakaseta)).toMatchObject(just(2));
          });

          describe('CP', () => {
            test('non-past', () => {
              expect(getPitch(kaku.kakaserareru)).toMatchObject(just(5));
            });

            test('negative', () => {
              expect(getPitch(kaku.kakaserarenai)).toMatchObject(just(5));
            });

            // test('polite', () => {
            //   // TODO: substantiate
            //   expect(getPitch(kaku.kakaseraremasu)).toMatchObject(just(6));
            // });

            test('gerundive', () => {
              expect(getPitch(kaku.kakaserarete)).toMatchObject(just(4));
            });

            test('past', () => {
              expect(getPitch(kaku.kakaserareta)).toMatchObject(just(4));
            });
          });
        });

        describe('passive', () => {
          test('non-past', () => {
            expect(getPitch(kaku.kakareru)).toMatchObject(just(3));
          });

          test('negative', () => {
            expect(getPitch(kaku.kakarenai)).toMatchObject(just(3));
          });

          // test('polite', () => {
          //   // TODO: substantiate
          //   expect(getPitch(kaku.kakaremasu)).toMatchObject(just(4));
          // });

          test('gerundive', () => {
            expect(getPitch(kaku.kakarete)).toMatchObject(just(2));
          });

          test('past', () => {
            expect(getPitch(kaku.kakareta)).toMatchObject(just(2));
          });
        });
      });

      describe('喜ぶ', () => {
        const yorokobu = unidicData.godan.accented.yorokobu;

        test('negative', () => {
          expect(getPitch(yorokobu.yorokobanai)).toMatchObject(just(4));
        });

        test('polite', () => {
          expect(getPitch(yorokobu.yorokobimasu)).toMatchObject(just(5));
        });

        test('non-past', () => {
          expect(getPitch(yorokobu.yorokobu)).toMatchObject(just(3));
        });

        test('gerundive', () => {
          expect(getPitch(yorokobu.yorokonde)).toMatchObject(just(3));
        });

        test('past', () => {
          expect(getPitch(yorokobu.yorokonda)).toMatchObject(just(3));
        });

        test('conditional', () => {
          expect(getPitch(yorokobu.yorokobeba)).toMatchObject(just(3));
        });

        test('volitional', () => {
          expect(getPitch(yorokobu.yorokobou)).toMatchObject(just(4));
        });
      });

      // nakadaka
      describe('作る', () => {
        const tsukuru = unidicData.godan.accented.tsukuru;
        test('negative', () => {
          expect(getPitch(tsukuru.tsukuranai)).toMatchObject(just(3));
        });

        test('polite', () => {
          expect(getPitch(tsukuru.tsukurimasu)).toMatchObject(just(4));
        });

        test('non-past', () => {
          expect(getPitch(tsukuru.tsukuru)).toMatchObject(just(2));
        });

        test('gerundive', () => {
          expect(getPitch(tsukuru.tsukutte)).toMatchObject(just(2));
        });

        test('past', () => {
          expect(getPitch(tsukuru.tsukutta)).toMatchObject(just(2));
        });

        test('conditional', () => {
          expect(getPitch(tsukuru.tsukureba)).toMatchObject(just(2));
        });

        test('volitional', () => {
          expect(getPitch(tsukuru.tsukurou)).toMatchObject(just(3));
        });

        test('causative', () => {
          expect(getPitch(tsukuru.tsukuraseru)).toMatchObject(just(4));
        });

        test('passive', () => {
          expect(getPitch(tsukuru.tsukurareru)).toMatchObject(just(4));
        });

        test('CP', () => {
          expect(getPitch(tsukuru.tsukuraserareru)).toMatchObject(just(6));
        });

        test('imperative', () => {
          expect(getPitch(tsukuru.tsukure)).toMatchObject(just(2));
        });
      });
    });

    describe('unaccented', () => {
      describe('働く', () => {
        const hataraku = unidicData.godan.unaccented.hataraku;

        test('negative', () => {
          expect(getPitch(hataraku.hatarakanai)).toMatchObject(just(0));
        });

        test('polite', () => {
          expect(getPitch(hataraku.hatarakimasu)).toMatchObject(just(5));
        });

        test('non-past', () => {
          expect(getPitch(hataraku.hataraku)).toMatchObject(just(0));
        });

        test('gerundive', () => {
          expect(getPitch(hataraku.hataraite)).toMatchObject(just(0));
        });

        test('past', () => {
          expect(getPitch(hataraku.hataraita)).toMatchObject(just(0));
        });

        test('conditional', () => {
          expect(getPitch(hataraku.hatarakeba)).toMatchObject(just(4));
        });

        test('volitional', () => {
          expect(getPitch(hataraku.hatarakou)).toMatchObject(just(4));
        });
      });
      describe('言う', () => {
        const iu = unidicData.godan.unaccented.iu;

        test('negative', () => {
          expect(getPitch(iu.iwanai)).toMatchObject(just(0));
        });

        test('polite', () => {
          expect(getPitch(iu.iimasu)).toMatchObject(just(3));
        });

        test('non-past', () => {
          expect(getPitch(iu.iu)).toMatchObject(just(0));
        });

        test('gerundive', () => {
          expect(getPitch(iu.itte)).toMatchObject(just(0));
        });

        test('past', () => {
          expect(getPitch(iu.itta)).toMatchObject(just(0));
        });

        test('conditional', () => {
          expect(getPitch(iu.ieba)).toMatchObject(just(1));
        });

        test('volitional', () => {
          expect(getPitch(iu.iou)).toMatchObject(just(1));
        });

        describe('causative', () => {
          test('non-past', () => {
            expect(getPitch(iu.iwaseru)).toMatchObject(just(0));
          });

          test('negative', () => {
            expect(getPitch(iu.iwasenai)).toMatchObject(just(0));
          });

          test('polite', () => {
            // TODO: substantiate
            expect(getPitch(iu.iwasemasu)).toMatchObject(just(4));
          });
        });

        test('passive', () => {
          expect(getPitch(iu.iwareru)).toMatchObject(just(0));
        });

        test('CP', () => {
          expect(getPitch(iu.iwaserareru)).toMatchObject(just(0));
        });

        test('imperative', () => {
          expect(getPitch(iu.ie)).toMatchObject(just(0));
        });
      });
    });
  });
});

/** A shorthand to help us expect 'just' a single prediction to be returned. */
function just(accent: number) {
  return { accent: [accent] };
}
