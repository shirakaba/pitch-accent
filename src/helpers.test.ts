import { describe, expect, test } from '@jest/globals';
import { syllables, morae } from './helpers';

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
      expect([...syllables('シ')]).toEqual(['シ']);
      expect([...syllables('シシ')]).toEqual(['シ', 'シ']);
      expect([...syllables('シシシ')]).toEqual(['シ', 'シ', 'シ']);
      expect([...syllables('さる')]).toEqual(['さ', 'る']);
      expect([...syllables('ながさき')]).toEqual(['な', 'が', 'さ', 'き']);
      expect([...syllables('コタモ')]).toEqual(['コ', 'タ', 'モ']);
      expect([...syllables('キソク')]).toEqual(['キ', 'ソ', 'ク']);
    });
    test('sokuon', () => {
      expect([...syllables('かっぱ')]).toEqual(['かっ', 'ぱ']);
      expect([...syllables('カッタ')]).toEqual(['カッ', 'タ']);
      expect([...syllables('にっぽん')]).toEqual(['にっ', 'ぽん']);
      expect([...syllables('ニッポン')]).toEqual(['ニッ', 'ポン']);
      expect([...syllables('がっこうしんぶん')]).toEqual([
        'がっ',
        'こう',
        'しん',
        'ぶん',
      ]);
      expect([...syllables('ガッコーシンブン')]).toEqual([
        'ガッ',
        'コー',
        'シン',
        'ブン',
      ]);
      expect([...syllables('コッモ')]).toEqual(['コッ', 'モ']);
    });
    test('stops', () => {
      expect([...syllables('かんそく')]).toEqual(['かん', 'そ', 'く']);
      expect([...syllables('にほん')]).toEqual(['に', 'ほん']);
      expect([...syllables('かん')]).toEqual(['かん']);
      expect([...syllables('コンモ')]).toEqual(['コン', 'モ']);
    });
    test('vowels', () => {
      expect([...syllables('オ')]).toEqual(['オ']);
      expect([...syllables('かあさん')]).toEqual(['かあ', 'さん']);
      expect([...syllables('おおさか')]).toEqual(['おお', 'さ', 'か']);
      expect([...syllables('とうきょう')]).toEqual(['とう', 'きょう']);
      expect([...syllables('にいさん')]).toEqual(['にい', 'さん']);
      // TODO: find out whether this should really be 2.
      expect([...syllables('かお')]).toEqual(['かお']);
    });
    test('chouonpu', () => {
      expect([...syllables('オー')]).toEqual(['オー']);
      expect([...syllables('コーモ')]).toEqual(['コー', 'モ']);
    });
    test('combiners', () => {
      expect([...syllables('チョコレート')]).toEqual([
        'チョ',
        'コ',
        'レー',
        'ト',
      ]);
      expect([...syllables('がっきゅうしんぶん')]).toEqual([
        'がっ',
        'きゅう',
        'しん',
        'ぶん',
      ]);
    });
  });
});
