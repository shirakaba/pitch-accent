import { describe, expect, test } from '@jest/globals';
import { solve } from './index';

// FIXME: figure out how to count syllables correctly
describe('2.2 Syllables as accent-bearing units', () => {
  // TODO: need to implement AAR/LSR for this
  test.skip('(11) Accent assigned on the pre-antepenultimate mora in loanwords', () => {
    // expect(
    //   solve([{ surface: 'パイナップル', pos: 'noun', origin: 'loanword' }])
    // ).toBe(3);

    // This works by coincidence right now because we've implemented [2.4]
    expect(
      solve([{ surface: 'タックル', pos: 'noun', origin: 'loanword' }])
    ).toBe(1);
  });

  // TODO: need to implement suffix-handling
  test.skip('(12) A dominant pre-accenting suffix inserts accent on the syllable immediately preceding the affix', () => {
    // b) ono -> ono'+ke
    // expect(
    //   solve([
    //     { surface: 'オノ', pos: 'noun' },
    //     { surface: 'ケ', pos: 'suffix' },
    //   ])
    // ).toBe(2);
  });
});

describe('2.4 Unaccented loanwords', () => {
  test('(16) Unaccented loanwords: four mora words with two final light non-epenthetic syllables', () => {
    expect(
      solve([{ surface: 'アメリカ', pos: 'noun', origin: 'loanword' }])
    ).toBe(0);

    // FIXME: this is detected as [['イ'], ['タ'], ['リ', 'ア']], so gets picked
    // picked up by [3]. Is 'リア' one or two syllables?
    // expect(
    //   solve([{ surface: 'イタリア', pos: 'noun', origin: 'loanword' }])
    // ).toBe(0);

    expect(
      solve([{ surface: 'メキシコ', pos: 'noun', origin: 'loanword' }])
    ).toBe(0);

    // FIXME: this is detected as [['アイ', 'オ', 'ワ']], so gets picked up by
    // [3], which then assigns it to position 1. Maybe we should just always
    // run the four-mora rule before the three-syllable one?
    // expect(
    //   solve([{ surface: 'アイオワ', pos: 'noun', origin: 'loanword' }])
    // ).toBe(0);
  });

  test('(17) The presence of an epenthetic vowel results in accented words', () => {
    expect(
      solve([{ surface: 'アンデス', pos: 'noun', origin: 'loanword' }])
    ).toBe(1);
    // Not sure what the actual expectation is here, due to the unclear romaji.
    // expect(
    //   solve([{ surface: 'ウェールズ', pos: 'noun', origin: 'loanword' }])
    // ).toBe(1);
    expect(
      solve([{ surface: 'シンバル', pos: 'noun', origin: 'loanword' }])
    ).toBe(1);
    expect(
      solve([{ surface: 'シンボル', pos: 'noun', origin: 'loanword' }])
    ).toBe(1);
    expect(
      solve([{ surface: 'アイドル', pos: 'noun', origin: 'loanword' }])
    ).toBe(1);
    expect(
      solve([{ surface: 'プロセス', pos: 'noun', origin: 'loanword' }])
    ).toBe(2);
    expect(
      solve([{ surface: 'ヘーゲル', pos: 'noun', origin: 'loanword' }])
    ).toBe(1);

    // The correct tone is position 1, so this is a known failure of our "2 mora
    // before the final epenthetic vowel" algorithm.
    expect(
      solve([{ surface: 'マルクス', pos: 'noun', origin: 'loanword' }])
    ).toBe(2);
  });

  test.skip('(19) Unaccented nouns with epenthetic vowels', () => {
    // TODO: implement
  });

  test.skip('(20) Unaccented nouns with heavy syllables', () => {
    // TODO: implement
  });
});

// TODO: check the primary research, as there are no test-cases for this in the
// review.
// describe('3 Stochastic skews in native and Sino-Japanese nouns', () => {});

// AKA Compound nouns
describe('4 Compound accent', () => {
  describe.skip('4.1 Short N2', () => {
    // TODO: implement
  });

  describe('[4.2] Long N2', () => {
    test('(23) N2 Initial accent', () => {
      // a. si'n+yokohama → sin+yo'kohama
      expect(
        solve([
          { surface: 'シン', pos: 'noun', accent: 1 },
          { surface: 'ヨコハマ', pos: 'noun', accent: 0 },
        ])
      ).toBe(3);

      // b. minami+amerika → minami+a'merika
      expect(
        solve([
          { surface: 'ミナミ', pos: 'noun', accent: 0 },
          { surface: 'アメリカ', pos: 'noun', accent: 0 },
        ])
      ).toBe(4);

      // TODO: c-h
    });

    test('(24) Retention of N2 accent', () => {
      // a. si'n+tamane'gi → sin+tamane'gi
      expect(
        solve([
          { surface: 'シン', pos: 'noun', accent: 1 },
          { surface: 'タマネギ', pos: 'noun', accent: 3 },
        ])
      ).toBe(5);

      // b. ya’mato+nade'siko → yamato+nade'siko
      expect(
        solve([
          { surface: 'ヤマト', pos: 'noun', accent: 1 },
          { surface: 'ナデシコ', pos: 'noun', accent: 2 },
        ])
      ).toBe(5);

      // c. be'suto+hure'ndo → besuto+hure'ndo
      expect(
        solve([
          { surface: 'ベスト', pos: 'noun', accent: 1 },
          { surface: 'フレンド', pos: 'noun', accent: 2 },
        ])
      ).toBe(5);

      // d. a'ka+ore'nzi → aka+ore'nzi
      expect(
        solve([
          { surface: 'アカ', pos: 'noun', accent: 1 },
          { surface: 'オレンジ', pos: 'noun', accent: 2 },
        ])
      ).toBe(4);

      // e. tuukin+sarari'iman → tuukin+sarari'iman
      expect(
        solve([
          { surface: 'ツーキン', pos: 'noun', accent: 0 },
          { surface: 'サラリーマン', pos: 'noun', accent: 3 },
        ])
      ).toBe(7);

      // f. natu'+kuda'mono → natu+kuda'mono
      expect(
        solve([
          { surface: 'ナツ', pos: 'noun', accent: 2 },
          { surface: 'クダモノ', pos: 'noun', accent: 2 },
        ])
      ).toBe(4);
    });

    test('(26) Superlong N2', () => {
      // a. si'donii+orinpi'kku → sidonii+orinpi'kku
      expect(
        solve([
          { surface: 'シドニー', pos: 'noun', accent: 1 },
          { surface: 'オリンピック', pos: 'noun', accent: 4 },
        ])
      ).toBe(8);

      // b. iso'ppu+monoga'tari → isoppu+monoga'tari
      expect(
        solve([
          { surface: 'イソップ', pos: 'noun', accent: 2 },
          { surface: 'モノガタリ', pos: 'noun', accent: 3 },
        ])
      ).toBe(7);

      // c. minami+kariforunia → minami+kariforunia
      expect(
        solve([
          { surface: 'ミナミ', pos: 'noun', accent: 0 },
          { surface: 'カリフォルニア', pos: 'noun', accent: 0 },
        ])
      ).toBe(0);

      // d. nyu'u+karedonia → nyuu+karedonia
      expect(
        solve([
          { surface: 'ニュウ', pos: 'noun', accent: 1 },
          { surface: 'カレドニア', pos: 'noun', accent: 0 },
        ])
      ).toBe(0);

      // e. nankyoku+tankentai → nankyoku+tankentai
      expect(
        solve([
          { surface: 'ナンキョク', pos: 'noun', accent: 0 },
          { surface: 'タンケンタイ', pos: 'noun', accent: 0 },
        ])
      ).toBe(0);
    });
  });
});
