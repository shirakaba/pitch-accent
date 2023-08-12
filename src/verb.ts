import { morae } from './helpers';
import { TokenVerb, Token } from './token';

export function verb(tokens: [TokenVerb, ...Token[]]) {
  const [v1, ...vs] = tokens;

  if (v1.accent === undefined) {
    return null;
  }

  if (!vs.length) {
    return v1.accent;
  }

  if (vs.length !== 1) {
    // Don't want to think about stringing multiple auxiliaries together just
    // yet.
    return null;
  }

  const v2 = vs[0];
  if (v2.pos !== 'auxiliary verb') {
    return null;
  }

  // FIXME: Implement stemming. UniDic doesn't provide stems in the data.
  const stem = v1.baseForm;
  const v1morae = [...morae(stem)];

  // V-final
  if (v1.group === 'ichidan') {
    if (v1.accent === 0) {
      if (['ます', 'れば', 'よう'].includes(v2.surface)) {
        return v1morae.length + 1;
      }
      return 0;
    }

    // TODO: check the precise rules for this - Dogen likely specified them.
    switch (v2.surface) {
      case 'ない':
        return v1morae.length;
      case 'ます':
        return v1morae.length + 1;
      case 'る':
        return v1.accent;
      case 'て':
      case 'た':
        return v1morae.length - 1;
      case 'れば':
        return v1morae.length;
      case 'よう':
        return v1morae.length + 1;
    }

    return null;
  }
}
