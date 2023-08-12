import { noun } from './noun';
import { Token, TokenVerb, TokenNoun } from './token';
import { verb } from './verb';

export function solve(tokens: [Token, ...Token[]]) {
  switch (tokens[0].pos) {
    case 'verb':
      return verb(tokens as [TokenVerb, ...Token[]]);
    case 'noun':
      return noun(tokens as [TokenNoun, ...Token[]]);
    default:
      return null;
  }
}

export { noun } from './noun';
export { verb } from './verb';
