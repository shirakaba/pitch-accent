import { describe, expect, test } from '@jest/globals';
import { syllables, morae, getHeadMoraPosition } from './helpers';

// https://en.wikipedia.org/wiki/On_(Japanese_prosody)
// https://ja.wikipedia.org/wiki/モーラ
// https://kotobank.jp/word/モーラ-142793
// https://kotobank.jp/word/拍-113598
// https://tamaoka.org/scholarly/sadokuari/2004/048.pdf
describe('Helpers', () => {
  describe('morae', () => {
    test('simple', () => {
      expect([...morae('みず')]).toEqual(['み', 'ず']);
      expect([...morae('さる')]).toEqual(['さ', 'る']);
    });
    test('sokuon', () => {
      expect([...morae('しっぽ')]).toEqual(['し', 'っ', 'ぽ']);
      expect([...morae('かっぱ')]).toEqual(['か', 'っ', 'ぱ']);
      expect([...morae('がっこうしんぶん')]).toEqual([
        'が',
        'っ',
        'こ',
        'う',
        'し',
        'ん',
        'ぶ',
        'ん',
      ]);
      expect([...morae('ガッコーシンブン')]).toEqual([
        'ガ',
        'ッ',
        'コ',
        'ー',
        'シ',
        'ン',
        'ブ',
        'ン',
      ]);
    });
    test('stops', () => {
      expect([...morae('さんぽ')]).toEqual(['さ', 'ん', 'ぽ']);
      expect([...morae('かんそく')]).toEqual(['か', 'ん', 'そ', 'く']);
    });
    test('vowels', () => {
      expect([...morae('かあさん')]).toEqual(['か', 'あ', 'さ', 'ん']);
      expect([...morae('カーサン')]).toEqual(['カ', 'ー', 'サ', 'ン']);
      expect([...morae('にいさん')]).toEqual(['に', 'い', 'さ', 'ん']);
      expect([...morae('ニーサン')]).toEqual(['ニ', 'ー', 'サ', 'ン']);
    });
    test('chouonpu', () => {
      expect([...morae('アパート')]).toEqual(['ア', 'パ', 'ー', 'ト']);
    });
    test('combiners', () => {
      expect([...morae('がっきゅう')]).toEqual(['が', 'っ', 'きゅ', 'う']);
      expect([...morae('チョコレート')]).toEqual([
        'チョ',
        'コ',
        'レ',
        'ー',
        'ト',
      ]);
      expect([...morae('がっきゅうしんぶん')]).toEqual([
        'が',
        'っ',
        'きゅ',
        'う',
        'し',
        'ん',
        'ぶ',
        'ん',
      ]);
      expect([...morae('ガッキューシンブン')]).toEqual([
        'ガ',
        'ッ',
        'キュ',
        'ー',
        'シ',
        'ン',
        'ブ',
        'ン',
      ]);
    });
  });

  describe('syllables', () => {
    test('simple', () => {
      expect([...syllables('シ')]).toEqual([['シ']]);
      expect([...syllables('シシ')]).toEqual([['シ'], ['シ']]);
      expect([...syllables('シシシ')]).toEqual([['シ'], ['シ'], ['シ']]);
      expect([...syllables('さる')]).toEqual([['さ'], ['る']]);
      expect([...syllables('ながさき')]).toEqual([
        ['な'],
        ['が'],
        ['さ'],
        ['き'],
      ]);
      expect([...syllables('コタモ')]).toEqual([['コ'], ['タ'], ['モ']]);
      expect([...syllables('キソク')]).toEqual([['キ'], ['ソ'], ['ク']]);
    });
    test('sokuon', () => {
      expect([...syllables('かっぱ')]).toEqual([['か', 'っ'], ['ぱ']]);
      expect([...syllables('カッタ')]).toEqual([['カ', 'ッ'], ['タ']]);
      expect([...syllables('にっぽん')]).toEqual([
        ['に', 'っ'],
        ['ぽ', 'ん'],
      ]);
      expect([...syllables('ニッポン')]).toEqual([
        ['ニ', 'ッ'],
        ['ポ', 'ン'],
      ]);
      expect([...syllables('がっこうしんぶん')]).toEqual([
        ['が', 'っ'],
        ['こ', 'う'],
        ['し', 'ん'],
        ['ぶ', 'ん'],
      ]);
      expect([...syllables('ガッコーシンブン')]).toEqual([
        ['ガ', 'ッ'],
        ['コ', 'ー'],
        ['シ', 'ン'],
        ['ブ', 'ン'],
      ]);
      expect([...syllables('コッモ')]).toEqual([['コ', 'ッ'], ['モ']]);
    });
    test('stops', () => {
      expect([...syllables('かんそく')]).toEqual([
        ['か', 'ん'],
        ['そ'],
        ['く'],
      ]);
      expect([...syllables('にほん')]).toEqual([['に'], ['ほ', 'ん']]);
      expect([...syllables('かん')]).toEqual([['か', 'ん']]);
      expect([...syllables('コンモ')]).toEqual([['コ', 'ン'], ['モ']]);
    });
    test('vowels', () => {
      expect([...syllables('オ')]).toEqual([['オ']]);
      expect([...syllables('かあさん')]).toEqual([
        ['か', 'あ'],
        ['さ', 'ん'],
      ]);
      expect([...syllables('おおさか')]).toEqual([
        ['お', 'お'],
        ['さ'],
        ['か'],
      ]);
      expect([...syllables('とうきょう')]).toEqual([
        ['と', 'う'],
        ['きょ', 'う'],
      ]);
      expect([...syllables('にいさん')]).toEqual([
        ['に', 'い'],
        ['さ', 'ん'],
      ]);
      // TODO: find out whether this should really be 2.
      expect([...syllables('かお')]).toEqual([['か', 'お']]);
    });
    test('chouonpu', () => {
      expect([...syllables('オー')]).toEqual([['オ', 'ー']]);
      expect([...syllables('コーモ')]).toEqual([['コ', 'ー'], ['モ']]);
    });
    test('combiners', () => {
      expect([...syllables('チョコレート')]).toEqual([
        ['チョ'],
        ['コ'],
        ['レ', 'ー'],
        ['ト'],
      ]);
      expect([...syllables('がっきゅうしんぶん')]).toEqual([
        ['が', 'っ'],
        ['きゅ', 'う'],
        ['し', 'ん'],
        ['ぶ', 'ん'],
      ]);
    });
  });

  describe('getHeadMoraPosition', () => {
    test('should find the head mora within a syllable', () => {
      // index from end:   ５    ４      ３    ２      １      ０
      // mora position:    １    ２      ３    ４      ５      ６
      const pineapple = [['パ', 'イ'], ['ナ', 'ッ'], ['プ'], ['ル']];

      // 'ル' (endIndex 0) is head, so return its position (6)
      expect(getHeadMoraPosition(0, pineapple)).toEqual(6);

      // 'プ' (endIndex 1) is head, so return its position (5)
      expect(getHeadMoraPosition(1, pineapple)).toEqual(5);

      // 'ッ' (endIndex 2) is non-head, so return the head position 'ナ' (3)
      expect(getHeadMoraPosition(2, pineapple)).toEqual(3);

      // 'ナ' (endIndex 3) is head, so return its position (3)
      expect(getHeadMoraPosition(3, pineapple)).toEqual(3);

      // 'イ' (endIndex 4) is non-head, so return the head position 'パ' (3)
      expect(getHeadMoraPosition(4, pineapple)).toEqual(1);

      // 'パ' (endIndex 5) is head, so return its position (1)
      expect(getHeadMoraPosition(5, pineapple)).toEqual(1);

      // undefined (endIndex 6) is out-of-bounds, so return null
      expect(getHeadMoraPosition(6, pineapple)).toEqual(null);
    });
  });
});
