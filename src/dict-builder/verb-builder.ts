import { UniDicToken, getGroup, parseAccent } from '../inflection';
import { TokenVerb } from '../token';
import { Base, conjugate, shiftChar } from '../verb';

export class VerbBuilder {
  private surface: string | null;
  private verb: TokenVerb | null;
  private readonly affixes: Affix[] = [];
  private currentForm: Base;
  private group: 'suru' | 'kuru' | 'godan' | 'ichidan' | null;

  constructor(private dictionaryForm: UniDicToken) {
    this.surface = dictionaryForm.surface;
    this.group = getGroup(dictionaryForm);
    this.currentForm = 'shuushikei';

    if (this.group) {
      this.verb = {
        surface: this.surface,
        pos: 'verb',
        group: this.group,
        baseForm: this.dictionaryForm.surface,
        accent: parseAccent(this.dictionaryForm.accent)?.[0] ?? undefined,
      } as const;
    } else {
      this.verb = null;
    }
  }

  get() {
    return this.surface;
  }

  toBase(base: Base) {
    if (!this.group || !this.surface) {
      return this;
    }

    const verb = {
      surface: this.surface,
      pos: 'verb',
      group: this.group,
      baseForm: this.dictionaryForm.surface,
      accent: parseAccent(this.dictionaryForm.accent)?.[0] ?? undefined,
    } as const;

    this.surface = conjugate(verb, base);
    if (!this.surface) {
      return this;
    }

    this.verb = {
      ...verb,
      surface: this.surface,
    };
    this.currentForm = base;

    return this;
  }

  addAffix(affix: Affix) {
    if (!this.verb || !this.surface) {
      return null;
    }

    switch (affix) {
      case 'conditional': {
        if (this.currentForm !== 'kateikei') {
          return null;
        }

        if (this.surface.endsWith('ない')) {
          this.surface = this.surface.replace(/ない$/, 'なければ');
          break;
        }

        switch (this.group) {
          case 'ichidan':
            this.surface += 'れば';
            break;
          default:
            this.surface += 'ば';
        }

        break;
      }
      case 'potential': {
        // Does not conjugate.
        if (['ある', '有る'].includes(this.verb.baseForm)) {
          return null;
        }

        if (this.group === 'godan') {
          if (this.currentForm !== 'kanoukei') {
            return null;
          }
        } else if (this.currentForm !== 'kateikei') {
          return null;
        }

        switch (this.group) {
          case 'godan':
            this.surface += 'る';
            break;
          case 'suru':
            this.surface = 'できる';
            break;
          case 'kuru':
          case 'ichidan':
            // We'll default to られる; users can find-and-replace to drop ら.
            // This contraction is specific to potential but not passive form.
            this.surface += 'られる';
            break;
        }

        break;
      }
      case 'imperative': {
        if (this.surface.endsWith('ます')) {
          this.surface = this.surface.replace(/ます$/, 'ませ');
          break;
        }

        if (this.currentForm !== 'meireikei') {
          return null;
        }

        switch (this.group) {
          case 'godan':
          case 'kuru':
          case 'suru':
            break;
          case 'ichidan':
            this.surface += 'ろ';
        }

        break;
      }
      case 'negative': {
        if (this.surface.endsWith('ます')) {
          this.surface = this.surface.replace(/ます$/, 'ません');
          break;
        }

        if (this.currentForm !== 'mizenkei') {
          return null;
        }

        if (['ある', '有る'].includes(this.surface)) {
          this.surface = 'ない';
          break;
        }

        switch (this.group) {
          case 'suru':
            // Our limited conjugate() function gives 'さ' for the mizenkei suru
            this.surface = 'しない';
            break;
          default:
            this.surface += 'ない';
        }

        break;
      }
      case 'passive': {
        if (this.currentForm !== 'mizenkei') {
          return null;
        }

        // Does not conjugate.
        if (['ある', '有る'].includes(this.verb.baseForm)) {
          return null;
        }

        // TODO: handle honorific

        switch (this.group) {
          case 'suru':
          case 'godan':
            this.surface += 'れる';
            break;
          case 'kuru':
          case 'ichidan':
            // We'll default to られる; users can find-and-replace to drop ら.
            // This contraction is specific to potential but not passive form.
            this.surface += 'られる';
            break;
        }

        break;
      }
      case 'causative': {
        if (this.currentForm !== 'mizenkei') {
          return null;
        }

        // Does not conjugate.
        if (['ある', '有る'].includes(this.verb.baseForm)) {
          return null;
        }

        // TODO: handle honorific

        switch (this.group) {
          case 'suru':
          case 'godan':
            this.surface += 'せる';
            break;
          case 'kuru':
          case 'ichidan':
            // We'll default to させる; users can find-and-replace to drop さ.
            // This contraction is specific to potential but not passive form.
            this.surface += 'させる';
            break;
        }

        break;
      }
      case 'volitional': {
        if (this.group === 'godan') {
          if (this.currentForm !== 'ishikei') {
            return null;
          }
        } else if (this.currentForm !== 'mizenkei') {
          return null;
        }

        if (['ある', '有る'].includes(this.verb.baseForm)) {
          this.surface = [...this.surface][0] + 'ろう';
          break;
        }

        // TODO: handle honorific

        switch (this.group) {
          case 'suru':
            this.surface = 'しよう';
            break;
          case 'godan':
            this.surface += 'う';
            break;
          case 'kuru':
          case 'ichidan':
            this.surface += 'よう';
            break;
        }

        break;
      }
      case 'conjunctive': {
        if (this.currentForm !== 'renyoukei') {
          return null;
        }

        // TODO: handle honorific

        // No changes necessary.

        break;
      }
      case 'perfective': {
        if (this.group === 'godan') {
          if (this.currentForm !== 'onbinkei') {
            return null;
          }
        } else if (this.currentForm !== 'renyoukei') {
          return null;
        }

        if (this.surface.endsWith('ます')) {
          this.surface = this.surface.replace(/ます$/, 'ました');
          break;
        }

        if (this.surface.endsWith('ない')) {
          this.surface = this.surface.replace(/ない$/, 'なかった');
          break;
        }

        if (this.verb.baseForm === '行く') {
          this.surface += 'った';
          break;
        }

        if (this.verb.baseForm === '問う') {
          this.surface = '問うた';
          break;
        }

        if (this.verb.baseForm === '講う') {
          this.surface = '講うた';
          break;
        }

        switch (this.group) {
          case 'godan': {
            const baseForm = this.verb.baseForm;
            if (
              ['る', 'う', 'つ'].some((ending) => baseForm.endsWith(ending))
            ) {
              this.surface += 'った';
              break;
            }

            if (baseForm.endsWith('す')) {
              this.surface += 'した';
              break;
            }

            if (baseForm.endsWith('く')) {
              this.surface += 'いた';
              break;
            }

            if (baseForm.endsWith('ぐ')) {
              this.surface += 'いだ';
              break;
            }

            if (
              ['ぶ', 'む', 'ぬ'].some((ending) => baseForm.endsWith(ending))
            ) {
              this.surface += 'んだ';
              break;
            }

            return null;
          }
          case 'ichidan':
          case 'suru':
          case 'kuru':
            this.surface += 'た';
            break;
        }

        break;
      }
      case 'te': {
        if (this.group === 'godan') {
          if (this.currentForm !== 'onbinkei') {
            return null;
          }
        } else {
          if (this.currentForm !== 'renyoukei') {
            return null;
          }
        }

        if (this.surface.endsWith('ます')) {
          this.surface = this.surface.replace(/ます$/, 'まして');
          break;
        }

        // If anyone wants ないで they'll have to form it themselves.
        if (this.surface.endsWith('ない')) {
          this.surface = this.surface.replace(/ない$/, 'なくて');
          break;
        }

        if (this.verb.baseForm === '行く') {
          this.surface += 'って';
          break;
        }

        if (this.verb.baseForm === '問う') {
          this.surface = '問うて';
          break;
        }

        if (this.verb.baseForm === '講う') {
          this.surface = '講うて';
          break;
        }

        switch (this.group) {
          case 'godan': {
            const baseForm = this.verb.baseForm;
            if (
              ['る', 'う', 'つ'].some((ending) => baseForm.endsWith(ending))
            ) {
              this.surface += 'って';
              break;
            }

            if (baseForm.endsWith('す')) {
              this.surface += 'して';
              break;
            }

            if (baseForm.endsWith('く')) {
              this.surface += 'いて';
              break;
            }

            if (baseForm.endsWith('ぐ')) {
              this.surface += 'いで';
              break;
            }

            if (
              ['ぶ', 'む', 'ぬ'].some((ending) => baseForm.endsWith(ending))
            ) {
              this.surface += 'んで';
              break;
            }

            return null;
          }
          case 'ichidan':
          case 'suru':
          case 'kuru':
            this.surface += 'て';
            break;
        }

        break;
      }
    }

    this.affixes.push(affix);
    // TODO: update currentForm

    return this;
  }
}

type Affix =
  | 'conditional'
  | 'potential'
  | 'imperative'
  | 'negative'
  | 'passive'
  | 'causative'
  | 'volitional'
  | 'conjunctive'
  | 'perfective'
  | 'te';
