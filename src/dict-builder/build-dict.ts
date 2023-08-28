import { UniDicToken } from '../inflection';
import { spawnSync } from 'node:child_process';
import { generateForms } from './generate-forms';
import { unidicData } from '../unidic-data';
import { getPitch, parseToUniDicToken } from '../inflection';

const forms = generateForms(unidicData.godan.accented.kaku.kaku[0]);

const { output, error } = spawnSync(
  'python',
  ['build-dict.py', '--i', forms.join('\n')],
  {
    encoding: 'utf8',
  }
);
if (error) {
  console.log('Error running the Python script', error);
  process.exit(1);
}

const payload = output.filter((line) => !!line).join('');
const formsTokenized = payload.split('\n===\n').map((entry, i) => {
  return [
    forms[i],
    entry
      .split('\n')
      .filter((token) => !!token)
      .map((token) => parseToUniDicToken(token)),
  ] as [surface: string, tokens: UniDicToken[]];
});

const pitches = formsTokenized.map(([surface, tokens]) => [
  surface,
  getPitch(tokens),
]);

console.dir(pitches, { depth: Infinity });
