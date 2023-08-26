import { unidicData } from './unidic-data';
import { VerbBuilder } from './verb-builder';
import { UniDicToken } from './inflection';

function generateForms(dictionaryForm: UniDicToken) {
  const verb = () => new VerbBuilder(dictionaryForm);

  return [
    verb().toBase("ren'youkei").get() + 'ます',
    verb().toBase("ren'youkei").get() + 'たい',
    verb().toBase('shuushikei').get(),
    verb().toBase('onbinkei').addAffix('te')?.get(),
    verb().toBase('onbinkei').addAffix('perfective')?.get(),
    verb().toBase('mizenkei').addAffix('negative')?.get(),
    verb().toBase('kateikei').addAffix('conditional')?.get(),
    verb().toBase('meireikei').addAffix('imperative')?.get(),
    verb().toBase('kanoukei').addAffix('potential')?.get(),
    verb().toBase('mizenkei').addAffix('passive')?.get(),
    verb().toBase('mizenkei').addAffix('causative')?.get(),
    verb().toBase('ishikei').addAffix('volitional')?.get(),
    [...verb().toBase('mizenkei').addAffix('causative')!.get()!]
      .slice(0, -1)
      .join('') + 'られる',
  ].join('\n');
}

console.log(generateForms(unidicData.godan.accented.kaku.kaku[0]));
