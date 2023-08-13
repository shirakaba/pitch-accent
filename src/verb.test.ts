import { describe, expect, test } from '@jest/globals';
import { deinflect, getPitch } from './verb';

describe('deinflect', () => {
  test('basic', () => {
    expect(deinflect('食べさせられたくなかった')).toEqual([
      { surface: '食べ', type: 'stem' },
      { surface: 'させ', type: 'causative' },
      { surface: 'られ', type: 'passive' },
      { surface: 'たく', type: 'desiderative' },
      { surface: 'なかっ', type: 'negative' },
      { surface: 'た', type: 'perfective' },
    ]);
  });
});

describe('getPitch', () => {
  test('basic', () => {
    expect(getPitch('食べさせられたくなかったようです。')).toEqual([
      { surface: '食べ', type: 'stem' },
      { surface: 'させ', type: 'causative' },
      { surface: 'られ', type: 'passive' },
      { surface: 'たく', type: 'desiderative' },
      { surface: 'なかっ', type: 'negative' },
      { surface: 'た', type: 'perfective' },
    ]);
  });
});

// describe('5 Verbs and adjectives', () => {
//   test('(27) Verb accent', () => {
//     // TODO: implement
//   });
// });
