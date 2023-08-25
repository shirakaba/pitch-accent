import { describe, expect, test } from '@jest/globals';
import { getPitch } from './inflection';
import { unidicData } from './unidic-data.test';

describe('getPitch', () => {
  describe('suru', () => {
    describe('する', () => {
      test('negative', () => {
        expect(getPitch(unidicData.suru.shinai)).toEqual(0);
      });

      test('polite', () => {
        expect(getPitch(unidicData.suru.shimasu)).toEqual(2);
      });

      test('non-past', () => {
        expect(getPitch(unidicData.suru.suru)).toEqual(0);
      });

      test('gerundive', () => {
        expect(getPitch(unidicData.suru.shite)).toEqual(0);
      });

      test('past', () => {
        expect(getPitch(unidicData.suru.shita)).toEqual(0);
      });

      test('conditional', () => {
        expect(getPitch(unidicData.suru.sureba)).toEqual(2);
      });

      test('volitional', () => {
        expect(getPitch(unidicData.suru.shiyou)).toEqual(2);
      });

      test('causative', () => {
        expect(getPitch(unidicData.suru.saseru)).toEqual(0);
      });

      test('passive', () => {
        expect(getPitch(unidicData.suru.sareru)).toEqual(0);
      });

      test('CP', () => {
        expect(getPitch(unidicData.suru.saserareru)).toEqual(0);
      });
    });
  });

  describe('kuru', () => {
    describe('来る', () => {
      test('negative', () => {
        expect(getPitch(unidicData.kuru.konai)).toEqual(1);
      });

      test('polite', () => {
        expect(getPitch(unidicData.kuru.kimasu)).toEqual(2);
      });

      test('non-past', () => {
        expect(getPitch(unidicData.kuru.kuru)).toEqual(1);
      });

      test('gerundive', () => {
        expect(getPitch(unidicData.kuru.kite)).toEqual(1);
      });

      test('past', () => {
        expect(getPitch(unidicData.kuru.kita)).toEqual(1);
      });

      test('conditional', () => {
        expect(getPitch(unidicData.kuru.kureba)).toEqual(1);
      });

      test('volitional', () => {
        expect(getPitch(unidicData.kuru.koyou)).toEqual(2);
      });

      test('causative', () => {
        expect(getPitch(unidicData.kuru.kosaseru)).toEqual(3);
      });

      test('passive', () => {
        expect(getPitch(unidicData.kuru.korareru)).toEqual(3);
      });

      test('CP', () => {
        expect(getPitch(unidicData.kuru.kosaserareru)).toEqual(5);
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
          expect(getPitch(hareru.harenai)).toEqual(2);
        });

        test('polite', () => {
          expect(getPitch(hareru.haremasu)).toEqual(3);
        });

        test('non-past', () => {
          expect(getPitch(hareru.hareru)).toEqual(2);
        });

        test('gerundive', () => {
          expect(getPitch(hareru.harete)).toEqual(1);
        });

        test('past', () => {
          expect(getPitch(hareru.hareta)).toEqual(1);
        });

        test('conditional', () => {
          expect(getPitch(hareru.harereba)).toEqual(2);
        });

        test('volitional', () => {
          expect(getPitch(hareru.hareyou)).toEqual(3);
        });
      });

      // atamadaka
      describe('見る', () => {
        const miru = unidicData.ichidan.accented.miru;
        test('negative', () => {
          expect(getPitch(miru.minai)).toEqual(1);
        });

        test('polite', () => {
          expect(getPitch(miru.mimasu)).toEqual(2);
        });

        test('non-past', () => {
          expect(getPitch(miru.miru)).toEqual(1);
        });

        test('gerundive', () => {
          expect(getPitch(miru.mite)).toEqual(1);
        });

        test('past', () => {
          expect(getPitch(miru.mita)).toEqual(1);
        });

        test('conditional', () => {
          expect(getPitch(miru.mireba)).toEqual(1);
        });

        test('volitional', () => {
          expect(getPitch(miru.miyou)).toEqual(2);
        });

        describe('causative', () => {
          test('non-past', () => {
            expect(getPitch(miru.misaseru)).toEqual(3);
          });

          test('negative', () => {
            expect(getPitch(miru.misasenai)).toEqual(3);
          });

          test('polite', () => {
            // TODO: substantiate
            expect(getPitch(miru.misasemasu)).toEqual(4);
          });
        });

        test('passive', () => {
          expect(getPitch(miru.mirareru)).toEqual(3);
        });

        describe('CP', () => {
          test('non-past', () => {
            expect(getPitch(miru.misaserareru)).toEqual(5);
          });
        });

        describe('accentless auxiliaries', () => {
          describe('simple', () => {
            test('〜に', () => {
              expect(getPitch(miru.mini)).toEqual(1);
            });
            // TODO: this is simply the past tense again; decide how to refactor
            test('〜た', () => {
              expect(getPitch(miru.mita)).toEqual(1);
            });
          });
        });
      });
    });

    describe('unaccented', () => {
      const hareru = unidicData.ichidan.unaccented.hareru;

      describe('腫れる', () => {
        test('negative', () => {
          expect(getPitch(hareru.harenai)).toEqual(0);
        });

        test('polite', () => {
          expect(getPitch(hareru.haremasu)).toEqual(3);
        });

        test('non-past', () => {
          expect(getPitch(hareru.hareru)).toEqual(0);
        });

        test('gerundive', () => {
          expect(getPitch(hareru.harete)).toEqual(0);
        });

        test('past', () => {
          expect(getPitch(hareru.hareta)).toEqual(0);
        });

        test('conditional', () => {
          expect(getPitch(hareru.harereba)).toEqual(3);
        });

        test('volitional', () => {
          expect(getPitch(hareru.hareyou)).toEqual(3);
        });

        // Warning! Passive of "to become swollen" doesn't really make any sense
        describe('passive', () => {
          test('negative', () => {
            expect(getPitch(hareru.harerarenai)).toEqual(0);
          });

          test('non-past', () => {
            expect(getPitch(hareru.harerareru)).toEqual(0);
          });

          test('gerundive', () => {
            expect(getPitch(hareru.harerarete)).toEqual(0);
          });

          test('past', () => {
            expect(getPitch(hareru.harerareta)).toEqual(0);
          });
        });

        describe('causative', () => {
          test('negative', () => {
            expect(getPitch(hareru.haresasenai)).toEqual(0);
          });

          test('non-past', () => {
            expect(getPitch(hareru.haresaseru)).toEqual(0);
          });

          test('gerundive', () => {
            expect(getPitch(hareru.haresasete)).toEqual(0);
          });

          test('past', () => {
            expect(getPitch(hareru.haresaseta)).toEqual(0);
          });

          describe('CP', () => {
            test('negative', () => {
              expect(getPitch(hareru.haresaserarenai)).toEqual(0);
            });

            test('non-past', () => {
              expect(getPitch(hareru.haresaserareru)).toEqual(0);
            });

            test('gerundive', () => {
              expect(getPitch(hareru.haresaserarete)).toEqual(0);
            });

            test('past', () => {
              expect(getPitch(hareru.haresaserareta)).toEqual(0);
            });
          });
        });
      });

      describe('始める', () => {
        const hajimeru = unidicData.ichidan.unaccented.hajimeru;
        test('negative', () => {
          expect(getPitch(hajimeru.hajimenai)).toEqual(0);
        });

        test('polite', () => {
          expect(getPitch(hajimeru.hajimemasu)).toEqual(4);
        });

        test('non-past', () => {
          expect(getPitch(hajimeru.hajimeru)).toEqual(0);
        });

        test('gerundive', () => {
          expect(getPitch(hajimeru.hajimete)).toEqual(0);
        });

        test('past', () => {
          expect(getPitch(hajimeru.hajimeta)).toEqual(0);
        });

        test('conditional', () => {
          expect(getPitch(hajimeru.hajimereba)).toEqual(4);
        });

        test('volitional', () => {
          expect(getPitch(hajimeru.hajimeyou)).toEqual(4);
        });

        test('causative', () => {
          expect(getPitch(hajimeru.hajimesaseru)).toEqual(0);
        });

        test('passive', () => {
          expect(getPitch(hajimeru.hajimerareru)).toEqual(0);
        });

        test('CP', () => {
          expect(getPitch(hajimeru.hajimesaserareru)).toEqual(0);
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
          expect(getPitch(kaku.kakanai)).toEqual(2);
        });

        test('polite', () => {
          expect(getPitch(kaku.kakimasu)).toEqual(3);
        });

        test('non-past', () => {
          expect(getPitch(kaku.kaku)).toEqual(1);
        });

        test('gerundive', () => {
          expect(getPitch(kaku.kaite)).toEqual(1);
        });

        test('past', () => {
          expect(getPitch(kaku.kaita)).toEqual(1);
        });

        test('conditional', () => {
          expect(getPitch(kaku.kakeba)).toEqual(1);
        });

        test('volitional', () => {
          expect(getPitch(kaku.kakou)).toEqual(2);
        });

        describe('causative', () => {
          test('non-past', () => {
            expect(getPitch(kaku.kakaseru)).toEqual(3);
          });

          test('negative', () => {
            expect(getPitch(kaku.kakasenai)).toEqual(3);
          });

          // test('polite', () => {
          //   // TODO: substantiate
          //   expect(getPitch(kaku.kakasemasu)).toEqual(4);
          // });

          test('gerundive', () => {
            expect(getPitch(kaku.kakasete)).toEqual(2);
          });

          test('past', () => {
            expect(getPitch(kaku.kakaseta)).toEqual(2);
          });

          describe('CP', () => {
            test('non-past', () => {
              expect(getPitch(kaku.kakaserareru)).toEqual(5);
            });

            test('negative', () => {
              expect(getPitch(kaku.kakaserarenai)).toEqual(5);
            });

            // test('polite', () => {
            //   // TODO: substantiate
            //   expect(getPitch(kaku.kakaseraremasu)).toEqual(6);
            // });

            test('gerundive', () => {
              expect(getPitch(kaku.kakaserarete)).toEqual(4);
            });

            test('past', () => {
              expect(getPitch(kaku.kakaserareta)).toEqual(4);
            });
          });
        });

        describe('passive', () => {
          test('non-past', () => {
            expect(getPitch(kaku.kakareru)).toEqual(3);
          });

          test('negative', () => {
            expect(getPitch(kaku.kakarenai)).toEqual(3);
          });

          // test('polite', () => {
          //   // TODO: substantiate
          //   expect(getPitch(kaku.kakaremasu)).toEqual(4);
          // });

          test('gerundive', () => {
            expect(getPitch(kaku.kakarete)).toEqual(2);
          });

          test('past', () => {
            expect(getPitch(kaku.kakareta)).toEqual(2);
          });
        });
      });

      describe('喜ぶ', () => {
        const yorokobu = unidicData.godan.accented.yorokobu;

        test('negative', () => {
          expect(getPitch(yorokobu.yorokobanai)).toEqual(4);
        });

        test('polite', () => {
          expect(getPitch(yorokobu.yorokobimasu)).toEqual(5);
        });

        test('non-past', () => {
          expect(getPitch(yorokobu.yorokobu)).toEqual(3);
        });

        test('gerundive', () => {
          expect(getPitch(yorokobu.yorokonde)).toEqual(3);
        });

        test('past', () => {
          expect(getPitch(yorokobu.yorokonda)).toEqual(3);
        });

        test('conditional', () => {
          expect(getPitch(yorokobu.yorokobeba)).toEqual(3);
        });

        test('volitional', () => {
          expect(getPitch(yorokobu.yorokobou)).toEqual(4);
        });
      });

      // nakadaka
      describe('作る', () => {
        const tsukuru = unidicData.godan.accented.tsukuru;
        test('negative', () => {
          expect(getPitch(tsukuru.tsukuranai)).toEqual(3);
        });

        test('polite', () => {
          expect(getPitch(tsukuru.tsukurimasu)).toEqual(4);
        });

        test('non-past', () => {
          expect(getPitch(tsukuru.tsukuru)).toEqual(2);
        });

        test('gerundive', () => {
          expect(getPitch(tsukuru.tsukutte)).toEqual(2);
        });

        test('past', () => {
          expect(getPitch(tsukuru.tsukutta)).toEqual(2);
        });

        test('conditional', () => {
          expect(getPitch(tsukuru.tsukureba)).toEqual(2);
        });

        test('volitional', () => {
          expect(getPitch(tsukuru.tsukurou)).toEqual(3);
        });

        test('causative', () => {
          expect(getPitch(tsukuru.tsukuraseru)).toEqual(4);
        });

        test('passive', () => {
          expect(getPitch(tsukuru.tsukurareru)).toEqual(4);
        });

        test('CP', () => {
          expect(getPitch(tsukuru.tsukuraserareru)).toEqual(6);
        });
      });
    });

    describe('unaccented', () => {
      describe('働く', () => {
        const hataraku = unidicData.godan.unaccented.hataraku;

        test('negative', () => {
          expect(getPitch(hataraku.hatarakanai)).toEqual(0);
        });

        test('polite', () => {
          expect(getPitch(hataraku.hatarakimasu)).toEqual(5);
        });

        test('non-past', () => {
          expect(getPitch(hataraku.hataraku)).toEqual(0);
        });

        test('gerundive', () => {
          expect(getPitch(hataraku.hataraite)).toEqual(0);
        });

        test('past', () => {
          expect(getPitch(hataraku.hataraita)).toEqual(0);
        });

        test('conditional', () => {
          expect(getPitch(hataraku.hatarakeba)).toEqual(4);
        });

        test('volitional', () => {
          expect(getPitch(hataraku.hatarakou)).toEqual(4);
        });
      });
      describe('言う', () => {
        const iu = unidicData.godan.unaccented.iu;

        test('negative', () => {
          expect(getPitch(iu.iwanai)).toEqual(0);
        });

        test('polite', () => {
          expect(getPitch(iu.iimasu)).toEqual(3);
        });

        test('non-past', () => {
          expect(getPitch(iu.iu)).toEqual(0);
        });

        test('gerundive', () => {
          expect(getPitch(iu.itte)).toEqual(0);
        });

        test('past', () => {
          expect(getPitch(iu.itta)).toEqual(0);
        });

        test('conditional', () => {
          expect(getPitch(iu.ieba)).toEqual(1);
        });

        test('volitional', () => {
          expect(getPitch(iu.iou)).toEqual(1);
        });

        describe('causative', () => {
          test('non-past', () => {
            expect(getPitch(iu.iwaseru)).toEqual(0);
          });

          test('negative', () => {
            expect(getPitch(iu.iwasenai)).toEqual(0);
          });

          test('polite', () => {
            // TODO: substantiate
            expect(getPitch(iu.iwasemasu)).toEqual(4);
          });
        });

        test('passive', () => {
          expect(getPitch(iu.iwareru)).toEqual(0);
        });

        test('CP', () => {
          expect(getPitch(iu.iwaserareru)).toEqual(0);
        });
      });
    });
  });
});
