import { describe, expect, test } from '@jest/globals';
import { solve } from './index';

// AKA Compound nouns
describe('4 Compound accent', () => {
  describe.skip('4.1 Short N2', () => {
    // TODO
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
