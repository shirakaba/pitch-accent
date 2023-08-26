import { unidicData } from './unidic-data';
import { VerbBuilder } from './verb-builder';
import { describe, expect, test } from '@jest/globals';

describe('verb-builder', () => {
  describe('godan', () => {
    describe('kaku', () => {
      test('mizenkei', () => {
        expect(
          new VerbBuilder(unidicData.godan.accented.kaku.kaku[0])
            .toBase('mizenkei')
            .get()
        ).toEqual('書か');
      });
    });
    describe('iu', () => {
      test('mizenkei', () => {
        expect(
          new VerbBuilder(unidicData.godan.unaccented.iu.iu[0])
            .toBase('mizenkei')
            .get()
        ).toEqual('言わ');
      });
    });
  });
  describe('ichidan', () => {
    // TODO
  });
});
