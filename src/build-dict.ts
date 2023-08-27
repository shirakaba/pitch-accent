import { unidicData } from './unidic-data';
import { VerbBuilder } from './verb-builder';
import { UniDicToken } from './inflection';

function generateForms(dictionaryForm: UniDicToken) {
  const verb = () => new VerbBuilder(dictionaryForm);

  return [
    verb().toBase('renyoukei').get() + 'ます',
    // TODO: ~tai form
    // verb().toBase('renyoukei').get() + 'たい',
    verb().toBase('renyoukei').get() + 'は',
    verb().toBase('shuushikei').get(),
    verb().toBase('shuushikei').get() + 'だけ',
    verb().toBase('shuushikei').get() + 'ほど',
    verb().toBase('shuushikei').get() + 'けれども',
    verb().toBase('shuushikei').get() + 'が',
    verb().toBase('shuushikei').get() + 'から',
    verb().toBase('shuushikei').get() + 'けれど',
    verb().toBase('shuushikei').get() + 'し',
    verb().toBase('shuushikei').get() + 'って',
    verb().toBase('shuushikei').get() + 'と',
    verb().toBase('shuushikei').get() + 'なら',
    verb().toBase('shuushikei').get() + 'しか',
    verb().toBase('shuushikei').get() + 'のだ',
    verb().toBase('shuushikei').get() + 'ので',
    verb().toBase('shuushikei').get() + 'そうだ',
    verb().toBase('shuushikei').get() + 'みたいだ',
    verb().toBase('shuushikei').get() + 'らしい',
    verb().toBase('shuushikei').get() + 'どころか',
    verb().toBase('shuushikei').get() + 'ようだ',
    verb().toBase('shuushikei').get() + 'ぐらい',
    verb().toBase('shuushikei').get() + 'くらい',
    verb().toBase('shuushikei').get() + 'ばかり',
    verb().toBase('shuushikei').get() + 'まで',
    verb().toBase('shuushikei').get() + 'だろう',
    verb().toBase('shuushikei').get() + 'でしょう',
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
