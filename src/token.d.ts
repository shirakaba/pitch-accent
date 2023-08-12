export type Token = TokenVerb | TokenNoun | TokenAuxiliaryVerb;

export interface TokenCommon {
  /**
   * The surface form of the token.
   */
  surface: string;
  /**
   * The pitch accent for the token. If multiple are possible (e.g. "0,3"), take
   * the most likely.
   */
  accent?: number;
}

export interface TokenNoun extends TokenCommon {
  pos: 'noun';
  origin?: 'native' | 'sino-japanese' | 'loanword';
}
export interface TokenVerb extends TokenCommon {
  pos: 'verb';
  /**
   * "godan" is also known as Group I or C-final.
   * "ichidan" is also known as Group II or V-final.
   */
  group: 'godan' | 'ichidan';
  /**
   * The dictionary form of the surface.
   */
  baseForm: string;
  accent?: number;
}
export interface TokenAuxiliaryVerb extends TokenCommon {
  pos: 'auxiliary verb';
}
