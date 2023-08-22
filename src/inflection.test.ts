import { describe, expect, test } from '@jest/globals';
import { UniDicToken, getPitch, parseToUniDicToken } from './inflection';

const unidicData = {
  suru: {
    shinai: [
      'し,動詞,非自立可能,*,*,サ行変格,未然形-一般,スル,為る,し,シ,する,スル,和,*,*,*,*,*,*,用,シ,スル,シ,スル,0,C5,*',
      'ない,助動詞,*,*,*,助動詞-ナイ,連体形-一般,ナイ,ない,ない,ナイ,ない,ナイ,和,*,*,*,*,*,*,助動,ナイ,ナイ,ナイ,ナイ,*,動詞%F3@0,*',
    ].map(parseToUniDicToken),
    shimasu: [
      'し,動詞,非自立可能,*,*,サ行変格,連用形-一般,スル,為る,し,シ,する,スル,和,*,*,*,*,*,*,用,シ,スル,シ,スル,0,C5,*',
      'ます,助動詞,*,*,*,助動詞-マス,終止形-一般,マス,ます,ます,マス,ます,マス,和,*,*,*,*,*,*,助動,マス,マス,マス,マス,*,動詞%F4@1,*',
    ].map(parseToUniDicToken),
    suru: [
      'する,動詞,非自立可能,*,*,サ行変格,連体形-一般,スル,為る,する,スル,する,スル,和,*,*,*,*,*,*,用,スル,スル,スル,スル,0,C5,*',
    ].map(parseToUniDicToken),
    shite: [
      'し,動詞,非自立可能,*,*,サ行変格,連用形-一般,スル,為る,し,シ,する,スル,和,*,*,*,*,*,*,用,シ,スル,シ,スル,0,C5,*',
      'て,助詞,接続助詞,*,*,*,*,テ,て,て,テ,て,テ,和,*,*,*,*,*,*,接助,テ,テ,テ,テ,*,動詞%F1,形容詞%F2@-1,*',
    ].map(parseToUniDicToken),
    shita: [
      'し,動詞,非自立可能,*,*,サ行変格,連用形-一般,スル,為る,し,シ,する,スル,和,*,*,*,*,*,*,用,シ,スル,シ,スル,0,C5,*',
      'た,助動詞,*,*,*,助動詞-タ,連体形-一般,タ,た,た,タ,た,タ,和,*,*,*,*,*,*,助動,タ,タ,タ,タ,*,動詞%F2@1,形容詞%F4@-2,*',
    ].map(parseToUniDicToken),
    sureba: [
      'すれ,動詞,非自立可能,*,*,サ行変格,仮定形-一般,スル,為る,すれ,スレ,する,スル,和,*,*,*,*,*,*,用,スレ,スル,スレ,スル,0,C5,*',
      'ば,助詞,接続助詞,*,*,*,*,バ,ば,ば,バ,ば,バ,和,*,*,*,*,*,*,接助,バ,バ,バ,バ,*,動詞%F2@0,形容詞%F2@-1,*',
    ].map(parseToUniDicToken),
    shiyou: [
      'しよう,動詞,非自立可能,*,*,サ行変格,意志推量形,スル,為る,しよう,シヨー,する,スル,和,*,*,*,*,*,*,用,シヨウ,スル,シヨウ,スル,0,C5,M1@1',
    ].map(parseToUniDicToken),
    sareru: [
      'さ,動詞,非自立可能,*,*,サ行変格,未然形-サ,スル,為る,さ,サ,する,スル,和,*,*,*,*,*,*,用,サ,スル,サ,スル,0,C5,*',
      'れる,助動詞,*,*,*,助動詞-レル,連体形-一般,レル,れる,れる,レル,れる,レル,和,*,*,*,*,*,*,助動,レル,レル,レル,レル,*,動詞%F3@1,*',
    ].map(parseToUniDicToken),
    saseru: [
      'さ,動詞,非自立可能,*,*,サ行変格,未然形-サ,スル,為る,さ,サ,する,スル,和,*,*,*,*,*,*,用,サ,スル,サ,スル,0,C5,*',
      'せる,助動詞,*,*,*,下一段-サ行,連体形-一般,セル,せる,せる,セル,せる,セル,和,*,*,*,*,*,*,助動,セル,セル,セル,セル,*,動詞%F3@1,*',
    ].map(parseToUniDicToken),
    saserareru: [
      'さ,動詞,非自立可能,*,*,サ行変格,未然形-サ,スル,為る,さ,サ,する,スル,和,*,*,*,*,*,*,用,サ,スル,サ,スル,0,C5,*',
      'せ,助動詞,*,*,*,下一段-サ行,未然形-一般,セル,せる,せ,セ,せる,セル,和,*,*,*,*,*,*,助動,セ,セル,セ,セル,*,動詞%F3@1,M4@1',
      'られる,助動詞,*,*,*,助動詞-レル,連体形-一般,ラレル,られる,られる,ラレル,られる,ラレル,和,*,*,*,*,*,*,助動,ラレル,ラレル,ラレル,ラレル,*,動詞%F3@2,*',
    ].map(parseToUniDicToken),
  },
  kuru: {
    konai: [
      '来,動詞,非自立可能,*,*,カ行変格,未然形-一般,クル,来る,来,コ,来る,クル,和,*,*,*,*,*,*,用,コ,クル,コ,クル,1,C1,*',
      'ない,助動詞,*,*,*,助動詞-ナイ,連体形-一般,ナイ,ない,ない,ナイ,ない,ナイ,和,*,*,*,*,*,*,助動,ナイ,ナイ,ナイ,ナイ,*,動詞%F3@0,*',
    ].map(parseToUniDicToken),
    kimasu: [
      '来,動詞,非自立可能,*,*,カ行変格,連用形-一般,クル,来る,来,キ,来る,クル,和,*,*,*,*,*,*,用,キ,クル,キ,クル,1,C1,*',
      'ます,助動詞,*,*,*,助動詞-マス,終止形-一般,マス,ます,ます,マス,ます,マス,和,*,*,*,*,*,*,助動,マス,マス,マス,マス,*,動詞%F4@1,*',
    ].map(parseToUniDicToken),
    kuru: [
      '来る,動詞,非自立可能,*,*,カ行変格,終止形-一般,クル,来る,来る,クル,来る,クル,和,*,*,*,*,*,*,用,クル,クル,クル,クル,1,C1,*',
    ].map(parseToUniDicToken),
    kite: [
      '来,動詞,非自立可能,*,*,カ行変格,連用形-一般,クル,来る,来,キ,来る,クル,和,*,*,*,*,*,*,用,キ,クル,キ,クル,1,C1,*',
      'て,助詞,接続助詞,*,*,*,*,テ,て,て,テ,て,テ,和,*,*,*,*,*,*,接助,テ,テ,テ,テ,*,動詞%F1,形容詞%F2@-1,*',
    ].map(parseToUniDicToken),
    kita: [
      '来,動詞,非自立可能,*,*,カ行変格,連用形-一般,クル,来る,来,キ,来る,クル,和,*,*,*,*,*,*,用,キ,クル,キ,クル,1,C1,*',
      'た,助動詞,*,*,*,助動詞-タ,連体形-一般,タ,た,た,タ,た,タ,和,*,*,*,*,*,*,助動,タ,タ,タ,タ,*,動詞%F2@1,形容詞%F4@-2,*',
    ].map(parseToUniDicToken),
    kureba: [
      '来れ,動詞,非自立可能,*,*,カ行変格,仮定形-一般,クル,来る,来れ,クレ,来る,クル,和,*,*,*,*,*,*,用,クレ,クル,クレ,クル,1,C1,*',
      'ば,助詞,接続助詞,*,*,*,*,バ,ば,ば,バ,ば,バ,和,*,*,*,*,*,*,接助,バ,バ,バ,バ,*,動詞%F2@0,形容詞%F2@-1,*',
    ].map(parseToUniDicToken),
    koyou: [
      '来よう,動詞,非自立可能,*,*,カ行変格,意志推量形,クル,来る,来よう,コヨー,来る,クル,和,*,*,*,*,*,*,用,コヨウ,クル,コヨウ,クル,1,C1,M1@1',
    ].map(parseToUniDicToken),
    kosaseru: [
      // Warning: I can't find any way to get MeCab UniDic to produce irrealis
      // form here, so I've manually patched this one. We may have to relax the
      // accepted inputs. It may, for example, give this renyoukei form:
      // '来,動詞,非自立可能,*,*,カ行変格,連用形-一般,クル,来る,来,キ,来る,クル,和,*,*,*,*,*,*,用,キ,クル,キ,クル,1,C1,*',
      '来,動詞,非自立可能,*,*,カ行変格,未然形-一般,クル,来る,来,コ,来る,クル,和,*,*,*,*,*,*,用,コ,クル,コ,クル,1,C1,*',
      'させる,助動詞,*,*,*,下一段-サ行,連体形-一般,サセル,させる,させる,サセル,させる,サセル,和,*,*,*,*,*,*,助動,サセル,サセル,サセル,サセル,*,動詞%F3@2,*',
    ].map(parseToUniDicToken),
    korareru: [
      '来,動詞,非自立可能,*,*,カ行変格,未然形-一般,クル,来る,来,コ,来る,クル,和,*,*,*,*,*,*,用,コ,クル,コ,クル,1,C1,*',
      'られる,助動詞,*,*,*,助動詞-レル,連体形-一般,ラレル,られる,られる,ラレル,られる,ラレル,和,*,*,*,*,*,*,助動,ラレル,ラレル,ラレル,ラレル,*,動詞%F3@2,*',
    ].map(parseToUniDicToken),
    kosaserareru: [
      // Warning: I can't find any way to get MeCab UniDic to produce irrealis
      // form here, so I've manually patched this one. We may have to relax the
      // accepted inputs. It may, for example, give this renyoukei form:
      // '来,動詞,非自立可能,*,*,カ行変格,連用形-一般,クル,来る,来,キ,来る,クル,和,*,*,*,*,*,*,用,キ,クル,キ,クル,1,C1,*',
      '来,動詞,非自立可能,*,*,カ行変格,未然形-一般,クル,来る,来,コ,来る,クル,和,*,*,*,*,*,*,用,コ,クル,コ,クル,1,C1,*',
      'させ,助動詞,*,*,*,下一段-サ行,未然形-一般,サセル,させる,させ,サセ,させる,サセル,和,*,*,*,*,*,*,助動,サセ,サセル,サセ,サセル,*,動詞%F3@2,M4@1',
      'られる,助動詞,*,*,*,助動詞-レル,連体形-一般,ラレル,られる,られる,ラレル,られる,ラレル,和,*,*,*,*,*,*,助動,ラレル,ラレル,ラレル,ラレル,*,動詞%F3@2,*',
    ].map(parseToUniDicToken),
  },
  ichidan: {
    accented: {
      // 晴れる
      hareru: {
        harenai: [
          '晴れ,動詞,一般,*,*,下一段-ラ行,未然形-一般,ハレル,晴れる,晴れ,ハレ,晴れる,ハレル,和,*,*,*,*,*,*,用,ハレ,ハレル,ハレ,ハレル,2,C1,M4@1',
          'ない,助動詞,*,*,*,助動詞-ナイ,終止形-一般,ナイ,ない,ない,ナイ,ない,ナイ,和,*,*,*,*,*,*,助動,ナイ,ナイ,ナイ,ナイ,*,動詞%F3@0,*',
        ].map(parseToUniDicToken),
        haremasu: [
          '晴れ,動詞,一般,*,*,下一段-ラ行,連用形-一般,ハレル,晴れる,晴れ,ハレ,晴れる,ハレル,和,*,*,*,*,*,*,用,ハレ,ハレル,ハレ,ハレル,2,C1,M4@1',
          'ます,助動詞,*,*,*,助動詞-マス,終止形-一般,マス,ます,ます,マス,ます,マス,和,*,*,*,*,*,*,助動,マス,マス,マス,マス,*,動詞%F4@1,*',
        ].map(parseToUniDicToken),
        hareru: [
          '晴れる,動詞,一般,*,*,下一段-ラ行,連体形-一般,ハレル,晴れる,晴れる,ハレル,晴れる,ハレル,和,*,*,*,*,*,*,用,ハレル,ハレル,ハレル,ハレル,2,C1,*',
        ].map(parseToUniDicToken),
        harete: [
          '晴れ,動詞,一般,*,*,下一段-ラ行,連用形-一般,ハレル,晴れる,晴れ,ハレ,晴れる,ハレル,和,*,*,*,*,*,*,用,ハレ,ハレル,ハレ,ハレル,2,C1,M4@1',
          'て,助詞,接続助詞,*,*,*,*,テ,て,て,テ,て,テ,和,*,*,*,*,*,*,接助,テ,テ,テ,テ,*,動詞%F1,形容詞%F2@-1,*',
        ].map(parseToUniDicToken),
        hareta: [
          '晴れ,動詞,一般,*,*,下一段-ラ行,連用形-一般,ハレル,晴れる,晴れ,ハレ,晴れる,ハレル,和,*,*,*,*,*,*,用,ハレ,ハレル,ハレ,ハレル,2,C1,M4@1',
          'た,助動詞,*,*,*,助動詞-タ,連体形-一般,タ,た,た,タ,た,タ,和,*,*,*,*,*,*,助動,タ,タ,タ,タ,*,動詞%F2@1,形容詞%F4@-2,*',
        ].map(parseToUniDicToken),
        harereba: [
          '晴れれ,動詞,一般,*,*,下一段-ラ行,仮定形-一般,ハレル,晴れる,晴れれ,ハレレ,晴れる,ハレル,和,*,*,*,*,*,*,用,ハレレ,ハレル,ハレレ,ハレル,2,C1,*',
          'ば,助詞,接続助詞,*,*,*,*,バ,ば,ば,バ,ば,バ,和,*,*,*,*,*,*,接助,バ,バ,バ,バ,*,動詞%F2@0,形容詞%F2@-1,*',
        ].map(parseToUniDicToken),
        hareyou: [
          '晴れよう,動詞,一般,*,*,下一段-ラ行,意志推量形,ハレル,晴れる,晴れよう,ハレヨー,晴れる,ハレル,和,*,*,*,*,*,*,用,ハレヨウ,ハレル,ハレヨウ,ハレル,2,C1,M1@1',
        ].map(parseToUniDicToken),
      },
      miru: {
        minai: [
          '見,動詞,非自立可能,*,*,上一段-マ行,未然形-一般,ミル,見る,見,ミ,見る,ミル,和,*,*,*,*,*,*,用,ミ,ミル,ミ,ミル,1,C1,M4@1',
          'ない,助動詞,*,*,*,助動詞-ナイ,連体形-一般,ナイ,ない,ない,ナイ,ない,ナイ,和,*,*,*,*,*,*,助動,ナイ,ナイ,ナイ,ナイ,*,動詞%F3@0,*',
        ].map(parseToUniDicToken),
        mimasu: [
          '見,動詞,非自立可能,*,*,上一段-マ行,連用形-一般,ミル,見る,見,ミ,見る,ミル,和,*,*,*,*,*,*,用,ミ,ミル,ミ,ミル,1,C1,M4@1',
          'ます,助動詞,*,*,*,助動詞-マス,終止形-一般,マス,ます,ます,マス,ます,マス,和,*,*,*,*,*,*,助動,マス,マス,マス,マス,*,動詞%F4@1,*',
        ].map(parseToUniDicToken),
        miru: [
          '見る,動詞,非自立可能,*,*,上一段-マ行,連体形-一般,ミル,見る,見る,ミル,見る,ミル,和,*,*,*,*,*,*,用,ミル,ミル,ミル,ミル,1,C1,*',
        ].map(parseToUniDicToken),
        mite: [
          '見,動詞,非自立可能,*,*,上一段-マ行,連用形-一般,ミル,見る,見,ミ,見る,ミル,和,*,*,*,*,*,*,用,ミ,ミル,ミ,ミル,1,C1,M4@1',
          'て,助詞,接続助詞,*,*,*,*,テ,て,て,テ,て,テ,和,*,*,*,*,*,*,接助,テ,テ,テ,テ,*,動詞%F1,形容詞%F2@-1,*',
        ].map(parseToUniDicToken),
        mita: [
          '見,動詞,非自立可能,*,*,上一段-マ行,連用形-一般,ミル,見る,見,ミ,見る,ミル,和,*,*,*,*,*,*,用,ミ,ミル,ミ,ミル,1,C1,M4@1',
          'た,助動詞,*,*,*,助動詞-タ,連体形-一般,タ,た,た,タ,た,タ,和,*,*,*,*,*,*,助動,タ,タ,タ,タ,*,動詞%F2@1,形容詞%F4@-2,*',
        ].map(parseToUniDicToken),
        mireba: [
          '見れ,動詞,非自立可能,*,*,上一段-マ行,仮定形-一般,ミル,見る,見れ,ミレ,見る,ミル,和,*,*,*,*,*,*,用,ミレ,ミル,ミレ,ミル,1,C1,*',
          'ば,助詞,接続助詞,*,*,*,*,バ,ば,ば,バ,ば,バ,和,*,*,*,*,*,*,接助,バ,バ,バ,バ,*,動詞%F2@0,形容詞%F2@-1,*',
        ].map(parseToUniDicToken),
        miyou: [
          '見よう,動詞,非自立可能,*,*,上一段-マ行,意志推量形,ミル,見る,見よう,ミヨー,見る,ミル,和,*,*,*,*,*,*,用,ミヨウ,ミル,ミヨウ,ミル,1,C1,M1@1',
        ].map(parseToUniDicToken),
        misaseru: [
          // Warning: I can't find any way to get MeCab UniDic to produce
          // irrealis form here, so I've manually patched this one. We may have
          // to relax the accepted inputs. It may, for example, give this
          // renyoukei form:
          // '見,動詞,非自立可能,*,*,上一段-マ行,連用形-一般,ミル,見る,見,ミ,見る,ミル,和,*,*,*,*,*,*,用,ミ,ミル,ミ,ミル,1,C1,M4@1',
          '見,動詞,非自立可能,*,*,上一段-マ行,未然形-一般,ミル,見る,見,ミ,見る,ミル,和,*,*,*,*,*,*,用,ミ,ミル,ミ,ミル,1,C1,M4@1',
          'させる,助動詞,*,*,*,下一段-サ行,連体形-一般,サセル,させる,させる,サセル,させる,サセル,和,*,*,*,*,*,*,助動,サセル,サセル,サセル,サセル,*,動詞%F3@2,*',
        ].map(parseToUniDicToken),
        mirareru: [
          '見,動詞,非自立可能,*,*,上一段-マ行,未然形-一般,ミル,見る,見,ミ,見る,ミル,和,*,*,*,*,*,*,用,ミ,ミル,ミ,ミル,1,C1,M4@1',
          'られる,助動詞,*,*,*,助動詞-レル,連体形-一般,ラレル,られる,られる,ラレル,られる,ラレル,和,*,*,*,*,*,*,助動,ラレル,ラレル,ラレル,ラレル,*,動詞%F3@2,*',
        ].map(parseToUniDicToken),
        misaserareru: [
          '見,動詞,非自立可能,*,*,上一段-マ行,未然形-一般,ミル,見る,見,ミ,見る,ミル,和,*,*,*,*,*,*,用,ミ,ミル,ミ,ミル,1,C1,M4@1',
          'させ,助動詞,*,*,*,下一段-サ行,未然形-一般,サセル,させる,させ,サセ,させる,サセル,和,*,*,*,*,*,*,助動,サセ,サセル,サセ,サセル,*,動詞%F3@2,M4@1',
          'られる,助動詞,*,*,*,助動詞-レル,連体形-一般,ラレル,られる,られる,ラレル,られる,ラレル,和,*,*,*,*,*,*,助動,ラレル,ラレル,ラレル,ラレル,*,動詞%F3@2,*',
        ].map(parseToUniDicToken),
        mini: [
          '見,動詞,非自立可能,*,*,上一段-マ行,連用形-一般,ミル,見る,見,ミ,見る,ミル,和,*,*,*,*,*,*,用,ミ,ミル,ミ,ミル,1,C1,M4@1',
          'に,助詞,格助詞,*,*,*,*,ニ,に,に,ニ,に,ニ,和,*,*,*,*,*,*,格助,ニ,ニ,ニ,ニ,*,名詞%F1,*',
        ].map(parseToUniDicToken),
      },
    },
    unaccented: {
      // 腫れる
      hareru: {
        harenai: [
          '腫れ,動詞,一般,*,*,下一段-ラ行,未然形-一般,ハレル,腫れる,腫れ,ハレ,腫れる,ハレル,和,*,*,*,*,*,*,用,ハレ,ハレル,ハレ,ハレル,0,C2,M4@1',
          'ない,助動詞,*,*,*,助動詞-ナイ,終止形-一般,ナイ,ない,ない,ナイ,ない,ナイ,和,*,*,*,*,*,*,助動,ナイ,ナイ,ナイ,ナイ,*,動詞%F3@0,*',
        ].map(parseToUniDicToken),
        haremasu: [
          '腫れ,動詞,一般,*,*,下一段-ラ行,連用形-一般,ハレル,腫れる,腫れ,ハレ,腫れる,ハレル,和,*,*,*,*,*,*,用,ハレ,ハレル,ハレ,ハレル,0,C2,M4@1',
          'ます,助動詞,*,*,*,助動詞-マス,終止形-一般,マス,ます,ます,マス,ます,マス,和,*,*,*,*,*,*,助動,マス,マス,マス,マス,*,動詞%F4@1,*',
        ].map(parseToUniDicToken),
        hareru: [
          '腫れる,動詞,一般,*,*,下一段-ラ行,連体形-一般,ハレル,腫れる,腫れる,ハレル,腫れる,ハレル,和,*,*,*,*,*,*,用,ハレル,ハレル,ハレル,ハレル,0,C2,*',
        ].map(parseToUniDicToken),
        harete: [
          '腫れ,動詞,一般,*,*,下一段-ラ行,連用形-一般,ハレル,腫れる,腫れ,ハレ,腫れる,ハレル,和,*,*,*,*,*,*,用,ハレ,ハレル,ハレ,ハレル,0,C2,M4@1',
          'て,助詞,接続助詞,*,*,*,*,テ,て,て,テ,て,テ,和,*,*,*,*,*,*,接助,テ,テ,テ,テ,*,動詞%F1,形容詞%F2@-1,*',
        ].map(parseToUniDicToken),
        hareta: [
          '腫れ,動詞,一般,*,*,下一段-ラ行,連用形-一般,ハレル,腫れる,腫れ,ハレ,腫れる,ハレル,和,*,*,*,*,*,*,用,ハレ,ハレル,ハレ,ハレル,0,C2,M4@1',
          'た,助動詞,*,*,*,助動詞-タ,連体形-一般,タ,た,た,タ,た,タ,和,*,*,*,*,*,*,助動,タ,タ,タ,タ,*,動詞%F2@1,形容詞%F4@-2,*',
        ].map(parseToUniDicToken),
        harereba: [
          '腫れれ,動詞,一般,*,*,下一段-ラ行,仮定形-一般,ハレル,腫れる,腫れれ,ハレレ,腫れる,ハレル,和,*,*,*,*,*,*,用,ハレレ,ハレル,ハレレ,ハレル,0,C2,*',
          'ば,助詞,接続助詞,*,*,*,*,バ,ば,ば,バ,ば,バ,和,*,*,*,*,*,*,接助,バ,バ,バ,バ,*,動詞%F2@0,形容詞%F2@-1,*',
        ].map(parseToUniDicToken),
        hareyou: [
          '腫れよう,動詞,一般,*,*,下一段-ラ行,意志推量形,ハレル,腫れる,腫れよう,ハレヨー,腫れる,ハレル,和,*,*,*,*,*,*,用,ハレヨウ,ハレル,ハレヨウ,ハレル,0,C2,M1@1',
        ].map(parseToUniDicToken),
      },
      // 始める
      hajimeru: {
        hajimenai: [
          '始め,動詞,非自立可能,*,*,下一段-マ行,未然形-一般,ハジメル,始める,始め,ハジメ,始める,ハジメル,和,*,*,*,*,*,*,用,ハジメ,ハジメル,ハジメ,ハジメル,0,C2,M4@1',
          'ない,助動詞,*,*,*,助動詞-ナイ,連体形-一般,ナイ,ない,ない,ナイ,ない,ナイ,和,*,*,*,*,*,*,助動,ナイ,ナイ,ナイ,ナイ,*,動詞%F3@0,*',
        ].map(parseToUniDicToken),
        hajimemasu: [
          '始め,動詞,非自立可能,*,*,下一段-マ行,連用形-一般,ハジメル,始める,始め,ハジメ,始める,ハジメル,和,*,*,*,*,*,*,用,ハジメ,ハジメル,ハジメ,ハジメル,0,C2,M4@1',
          'ます,助動詞,*,*,*,助動詞-マス,終止形-一般,マス,ます,ます,マス,ます,マス,和,*,*,*,*,*,*,助動,マス,マス,マス,マス,*,動詞%F4@1,*',
        ].map(parseToUniDicToken),
        hajimeru: [
          '始める,動詞,非自立可能,*,*,下一段-マ行,終止形-一般,ハジメル,始める,始める,ハジメル,始める,ハジメル,和,*,*,*,*,*,*,用,ハジメル,ハジメル,ハジメル,ハジメル,0,C2,*',
        ].map(parseToUniDicToken),
        hajimete: [
          '始め,動詞,非自立可能,*,*,下一段-マ行,連用形-一般,ハジメル,始める,始め,ハジメ,始める,ハジメル,和,*,*,*,*,*,*,用,ハジメ,ハジメル,ハジメ,ハジメル,0,C2,M4@1',
          'て,助詞,接続助詞,*,*,*,*,テ,て,て,テ,て,テ,和,*,*,*,*,*,*,接助,テ,テ,テ,テ,*,動詞%F1,形容詞%F2@-1,*',
        ].map(parseToUniDicToken),
        hajimeta: [
          '始め,動詞,非自立可能,*,*,下一段-マ行,連用形-一般,ハジメル,始める,始め,ハジメ,始める,ハジメル,和,*,*,*,*,*,*,用,ハジメ,ハジメル,ハジメ,ハジメル,0,C2,M4@1',
          'た,助動詞,*,*,*,助動詞-タ,連体形-一般,タ,た,た,タ,た,タ,和,*,*,*,*,*,*,助動,タ,タ,タ,タ,*,動詞%F2@1,形容詞%F4@-2,*',
        ].map(parseToUniDicToken),
        hajimereba: [
          '始めれ,動詞,非自立可能,*,*,下一段-マ行,仮定形-一般,ハジメル,始める,始めれ,ハジメレ,始める,ハジメル,和,*,*,*,*,*,*,用,ハジメレ,ハジメル,ハジメレ,ハジメル,0,C2,*',
          'ば,助詞,接続助詞,*,*,*,*,バ,ば,ば,バ,ば,バ,和,*,*,*,*,*,*,接助,バ,バ,バ,バ,*,動詞%F2@0,形容詞%F2@-1,*',
        ].map(parseToUniDicToken),
        hajimeyou: [
          '始めよう,動詞,非自立可能,*,*,下一段-マ行,意志推量形,ハジメル,始める,始めよう,ハジメヨー,始める,ハジメル,和,*,*,*,*,*,*,用,ハジメヨウ,ハジメル,ハジメヨウ,ハジメル,0,C2,M1@1',
        ].map(parseToUniDicToken),
        hajimesaseru: [
          // May give renyoukei by accident (ichidan-specific problem?):
          // 始め,動詞,非自立可能,*,*,下一段-マ行,連用形-一般,ハジメル,始める,始め,ハジメ,始める,ハジメル,和,*,*,*,*,*,*,用,ハジメ,ハジメル,ハジメ,ハジメル,0,C2,M4@1
          '始め,動詞,非自立可能,*,*,下一段-マ行,未然形-一般,ハジメル,始める,始め,ハジメ,始める,ハジメル,和,*,*,*,*,*,*,用,ハジメ,ハジメル,ハジメ,ハジメル,0,C2,M4@1',
          'させる,助動詞,*,*,*,下一段-サ行,連体形-一般,サセル,させる,させる,サセル,させる,サセル,和,*,*,*,*,*,*,助動,サセル,サセル,サセル,サセル,*,動詞%F3@2,*',
        ].map(parseToUniDicToken),
        hajimerareru: [
          '始め,動詞,非自立可能,*,*,下一段-マ行,未然形-一般,ハジメル,始める,始め,ハジメ,始める,ハジメル,和,*,*,*,*,*,*,用,ハジメ,ハジメル,ハジメ,ハジメル,0,C2,M4@1',
          'られる,助動詞,*,*,*,助動詞-レル,連体形-一般,ラレル,られる,られる,ラレル,られる,ラレル,和,*,*,*,*,*,*,助動,ラレル,ラレル,ラレル,ラレル,*,動詞%F3@2,*',
        ].map(parseToUniDicToken),
        hajimesaserareru: [
          '始め,動詞,非自立可能,*,*,下一段-マ行,未然形-一般,ハジメル,始める,始め,ハジメ,始める,ハジメル,和,*,*,*,*,*,*,用,ハジメ,ハジメル,ハジメ,ハジメル,0,C2,M4@1',
          'させ,助動詞,*,*,*,下一段-サ行,未然形-一般,サセル,させる,させ,サセ,させる,サセル,和,*,*,*,*,*,*,助動,サセ,サセル,サセ,サセル,*,動詞%F3@2,M4@1',
          'られる,助動詞,*,*,*,助動詞-レル,連体形-一般,ラレル,られる,られる,ラレル,られる,ラレル,和,*,*,*,*,*,*,助動,ラレル,ラレル,ラレル,ラレル,*,動詞%F3@2,*',
        ].map(parseToUniDicToken),
      },
    },
  },
  godan: {
    accented: {
      yorokobu: {
        yorokobanai: [
          '喜ば,動詞,一般,*,*,五段-バ行,未然形-一般,ヨロコブ,喜ぶ,喜ば,ヨロコバ,喜ぶ,ヨロコブ,和,*,*,*,*,*,*,用,ヨロコバ,ヨロコブ,ヨロコバ,ヨロコブ,3,C1,*',
          'ない,助動詞,*,*,*,助動詞-ナイ,連体形-一般,ナイ,ない,ない,ナイ,ない,ナイ,和,*,*,*,*,*,*,助動,ナイ,ナイ,ナイ,ナイ,*,動詞%F3@0,*',
        ].map(parseToUniDicToken),
        yorokobimasu: [
          '喜び,動詞,一般,*,*,五段-バ行,連用形-一般,ヨロコブ,喜ぶ,喜び,ヨロコビ,喜ぶ,ヨロコブ,和,*,*,*,*,*,*,用,ヨロコビ,ヨロコブ,ヨロコビ,ヨロコブ,3,C1,*',
          'ます,助動詞,*,*,*,助動詞-マス,終止形-一般,マス,ます,ます,マス,ます,マス,和,*,*,*,*,*,*,助動,マス,マス,マス,マス,*,動詞%F4@1,*',
        ].map(parseToUniDicToken),
        yorokobu: [
          '喜ぶ,動詞,一般,*,*,五段-バ行,連体形-一般,ヨロコブ,喜ぶ,喜ぶ,ヨロコブ,喜ぶ,ヨロコブ,和,*,*,*,*,*,*,用,ヨロコブ,ヨロコブ,ヨロコブ,ヨロコブ,3,C1,*',
        ].map(parseToUniDicToken),
        yorokonde: [
          '喜ん,動詞,一般,*,*,五段-バ行,連用形-撥音便,ヨロコブ,喜ぶ,喜ん,ヨロコン,喜ぶ,ヨロコブ,和,*,*,*,*,*,*,用,ヨロコン,ヨロコブ,ヨロコン,ヨロコブ,3,C1,*',
          'で,助詞,接続助詞,*,*,*,*,テ,て,で,デ,で,デ,和,*,*,*,*,*,*,接助,デ,デ,デ,デ,*,動詞%F1,形容詞%F2@-1,*',
        ].map(parseToUniDicToken),
        yorokonda: [
          '喜ん,動詞,一般,*,*,五段-バ行,連用形-撥音便,ヨロコブ,喜ぶ,喜ん,ヨロコン,喜ぶ,ヨロコブ,和,*,*,*,*,*,*,用,ヨロコン,ヨロコブ,ヨロコン,ヨロコブ,3,C1,*',
          'だ,助動詞,*,*,*,助動詞-タ,連体形-一般,タ,た,だ,ダ,だ,ダ,和,*,*,*,*,*,*,助動,ダ,ダ,ダ,ダ,*,動詞%F2@1,*',
        ].map(parseToUniDicToken),
        yorokobeba: [
          '喜べ,動詞,一般,*,*,五段-バ行,仮定形-一般,ヨロコブ,喜ぶ,喜べ,ヨロコベ,喜ぶ,ヨロコブ,和,*,*,*,*,*,*,用,ヨロコベ,ヨロコブ,ヨロコベ,ヨロコブ,3,C1,*',
          'ば,助詞,接続助詞,*,*,*,*,バ,ば,ば,バ,ば,バ,和,*,*,*,*,*,*,接助,バ,バ,バ,バ,*,動詞%F2@0,形容詞%F2@-1,*',
        ].map(parseToUniDicToken),
        yorokobou: [
          '喜ぼう,動詞,一般,*,*,五段-バ行,意志推量形,ヨロコブ,喜ぶ,喜ぼう,ヨロコボー,喜ぶ,ヨロコブ,和,*,*,*,*,*,*,用,ヨロコボウ,ヨロコブ,ヨロコボウ,ヨロコブ,3,C1,M1@1',
        ].map(parseToUniDicToken),
      },
      tsukuru: {
        tsukuranai: [
          '作ら,動詞,一般,*,*,五段-ラ行,未然形-一般,ツクル,作る,作ら,ツクラ,作る,ツクル,和,ツ濁,基本形,*,*,*,*,用,ツクラ,ツクル,ツクラ,ツクル,2,C1,*',
          'ない,助動詞,*,*,*,助動詞-ナイ,連体形-一般,ナイ,ない,ない,ナイ,ない,ナイ,和,*,*,*,*,*,*,助動,ナイ,ナイ,ナイ,ナイ,*,動詞%F3@0,*',
        ].map(parseToUniDicToken),
        tsukurimasu: [
          '作り,動詞,一般,*,*,五段-ラ行,連用形-一般,ツクル,作る,作り,ツクリ,作る,ツクル,和,ツ濁,基本形,*,*,*,*,用,ツクリ,ツクル,ツクリ,ツクル,2,C1,*',
          'ます,助動詞,*,*,*,助動詞-マス,終止形-一般,マス,ます,ます,マス,ます,マス,和,*,*,*,*,*,*,助動,マス,マス,マス,マス,*,動詞%F4@1,*',
        ].map(parseToUniDicToken),
        tsukuru: [
          '作る,動詞,一般,*,*,五段-ラ行,連体形-一般,ツクル,作る,作る,ツクル,作る,ツクル,和,ツ濁,基本形,*,*,*,*,用,ツクル,ツクル,ツクル,ツクル,2,C1,*',
        ].map(parseToUniDicToken),
        tsukutte: [
          '作っ,動詞,一般,*,*,五段-ラ行,連用形-促音便,ツクル,作る,作っ,ツクッ,作る,ツクル,和,ツ濁,基本形,*,*,*,*,用,ツクッ,ツクル,ツクッ,ツクル,2,C1,*',
          'て,助詞,接続助詞,*,*,*,*,テ,て,て,テ,て,テ,和,*,*,*,*,*,*,接助,テ,テ,テ,テ,*,動詞%F1,形容詞%F2@-1,*',
        ].map(parseToUniDicToken),
        tsukutta: [
          '作っ,動詞,一般,*,*,五段-ラ行,連用形-促音便,ツクル,作る,作っ,ツクッ,作る,ツクル,和,ツ濁,基本形,*,*,*,*,用,ツクッ,ツクル,ツクッ,ツクル,2,C1,*',
          'た,助動詞,*,*,*,助動詞-タ,連体形-一般,タ,た,た,タ,た,タ,和,*,*,*,*,*,*,助動,タ,タ,タ,タ,*,動詞%F2@1,形容詞%F4@-2,*',
        ].map(parseToUniDicToken),
        tsukureba: [
          '作れ,動詞,一般,*,*,五段-ラ行,仮定形-一般,ツクル,作る,作れ,ツクレ,作る,ツクル,和,ツ濁,基本形,*,*,*,*,用,ツクレ,ツクル,ツクレ,ツクル,2,C1,*',
          'ば,助詞,接続助詞,*,*,*,*,バ,ば,ば,バ,ば,バ,和,*,*,*,*,*,*,接助,バ,バ,バ,バ,*,動詞%F2@0,形容詞%F2@-1,*',
        ].map(parseToUniDicToken),
        tsukurou: [
          '作ろう,動詞,一般,*,*,五段-ラ行,意志推量形,ツクル,作る,作ろう,ツクロー,作る,ツクル,和,ツ濁,基本形,*,*,*,*,用,ツクロウ,ツクル,ツクロウ,ツクル,2,C1,M1@1',
        ].map(parseToUniDicToken),
        tsukuraseru: [
          '作ら,動詞,一般,*,*,五段-ラ行,未然形-一般,ツクル,作る,作ら,ツクラ,作る,ツクル,和,ツ濁,基本形,*,*,*,*,用,ツクラ,ツクル,ツクラ,ツクル,2,C1,*',
          'せる,助動詞,*,*,*,下一段-サ行,連体形-一般,セル,せる,せる,セル,せる,セル,和,*,*,*,*,*,*,助動,セル,セル,セル,セル,*,動詞%F3@1,*',
        ].map(parseToUniDicToken),
        tsukurareru: [
          '作ら,動詞,一般,*,*,五段-ラ行,未然形-一般,ツクル,作る,作ら,ツクラ,作る,ツクル,和,ツ濁,基本形,*,*,*,*,用,ツクラ,ツクル,ツクラ,ツクル,2,C1,*',
          'れる,助動詞,*,*,*,助動詞-レル,連体形-一般,レル,れる,れる,レル,れる,レル,和,*,*,*,*,*,*,助動,レル,レル,レル,レル,*,動詞%F3@1,*',
        ].map(parseToUniDicToken),
        tsukuraserareru: [
          '作ら,動詞,一般,*,*,五段-ラ行,未然形-一般,ツクル,作る,作ら,ツクラ,作る,ツクル,和,ツ濁,基本形,*,*,*,*,用,ツクラ,ツクル,ツクラ,ツクル,2,C1,*',
          'せ,助動詞,*,*,*,下一段-サ行,未然形-一般,セル,せる,せ,セ,せる,セル,和,*,*,*,*,*,*,助動,セ,セル,セ,セル,*,動詞%F3@1,M4@1',
          'られる,助動詞,*,*,*,助動詞-レル,連体形-一般,ラレル,られる,られる,ラレル,られる,ラレル,和,*,*,*,*,*,*,助動,ラレル,ラレル,ラレル,ラレル,*,動詞%F3@2,*',
        ].map(parseToUniDicToken),
      },
    },
    unaccented: {
      hataraku: {
        hatarakanai: [
          '働か,動詞,一般,*,*,五段-カ行,未然形-一般,ハタラク,働く,働か,ハタラカ,働く,ハタラク,和,*,*,*,*,*,*,用,ハタラカ,ハタラク,ハタラカ,ハタラク,0,C2,*',
          'ない,助動詞,*,*,*,助動詞-ナイ,連体形-一般,ナイ,ない,ない,ナイ,ない,ナイ,和,*,*,*,*,*,*,助動,ナイ,ナイ,ナイ,ナイ,*,動詞%F3@0,*',
        ].map(parseToUniDicToken),
        hatarakimasu: [
          '働き,動詞,一般,*,*,五段-カ行,連用形-一般,ハタラク,働く,働き,ハタラキ,働く,ハタラク,和,*,*,*,*,*,*,用,ハタラキ,ハタラク,ハタラキ,ハタラク,0,C2,*',
          'ます,助動詞,*,*,*,助動詞-マス,終止形-一般,マス,ます,ます,マス,ます,マス,和,*,*,*,*,*,*,助動,マス,マス,マス,マス,*,動詞%F4@1,*',
        ].map(parseToUniDicToken),
        hataraku: [
          '働く,動詞,一般,*,*,五段-カ行,連体形-一般,ハタラク,働く,働く,ハタラク,働く,ハタラク,和,*,*,*,*,*,*,用,ハタラク,ハタラク,ハタラク,ハタラク,0,C2,*',
        ].map(parseToUniDicToken),
        hataraite: [
          '働い,動詞,一般,*,*,五段-カ行,連用形-イ音便,ハタラク,働く,働い,ハタライ,働く,ハタラク,和,*,*,*,*,*,*,用,ハタライ,ハタラク,ハタライ,ハタラク,0,C2,*',
          'て,助詞,接続助詞,*,*,*,*,テ,て,て,テ,て,テ,和,*,*,*,*,*,*,接助,テ,テ,テ,テ,*,動詞%F1,形容詞%F2@-1,*',
        ].map(parseToUniDicToken),
        hataraita: [
          '働い,動詞,一般,*,*,五段-カ行,連用形-イ音便,ハタラク,働く,働い,ハタライ,働く,ハタラク,和,*,*,*,*,*,*,用,ハタライ,ハタラク,ハタライ,ハタラク,0,C2,*',
          'た,助動詞,*,*,*,助動詞-タ,連体形-一般,タ,た,た,タ,た,タ,和,*,*,*,*,*,*,助動,タ,タ,タ,タ,*,動詞%F2@1,形容詞%F4@-2,*',
        ].map(parseToUniDicToken),
        hatarakeba: [
          '働け,動詞,一般,*,*,五段-カ行,仮定形-一般,ハタラク,働く,働け,ハタラケ,働く,ハタラク,和,*,*,*,*,*,*,用,ハタラケ,ハタラク,ハタラケ,ハタラク,0,C2,*',
          'ば,助詞,接続助詞,*,*,*,*,バ,ば,ば,バ,ば,バ,和,*,*,*,*,*,*,接助,バ,バ,バ,バ,*,動詞%F2@0,形容詞%F2@-1,*',
        ].map(parseToUniDicToken),
        hatarakou: [
          '働こう,動詞,一般,*,*,五段-カ行,意志推量形,ハタラク,働く,働こう,ハタラコー,働く,ハタラク,和,*,*,*,*,*,*,用,ハタラコウ,ハタラク,ハタラコウ,ハタラク,0,C2,M1@1',
        ].map(parseToUniDicToken),
      },
      iu: {
        iwanai: [
          '言わ,動詞,一般,*,*,五段-ワア行,未然形-一般,イウ,言う,言わ,イワ,言う,イウ,和,*,*,*,*,*,*,用,イワ,イウ,イワ,イウ,0,C2,*',
          'ない,助動詞,*,*,*,助動詞-ナイ,連体形-一般,ナイ,ない,ない,ナイ,ない,ナイ,和,*,*,*,*,*,*,助動,ナイ,ナイ,ナイ,ナイ,*,動詞%F3@0,*',
        ].map(parseToUniDicToken),
        iimasu: [
          '言い,動詞,一般,*,*,五段-ワア行,連用形-一般,イウ,言う,言い,イー,言う,イウ,和,*,*,*,*,*,*,用,イイ,イウ,イイ,イウ,0,C2,*',
          'ます,助動詞,*,*,*,助動詞-マス,終止形-一般,マス,ます,ます,マス,ます,マス,和,*,*,*,*,*,*,助動,マス,マス,マス,マス,*,動詞%F4@1,*',
        ].map(parseToUniDicToken),
        iu: [
          '言う,動詞,一般,*,*,五段-ワア行,連体形-一般,イウ,言う,言う,イウ,言う,イウ,和,*,*,*,*,*,*,用,イウ,イウ,イウ,イウ,0,C2,*',
        ].map(parseToUniDicToken),
        itte: [
          '言っ,動詞,一般,*,*,五段-ワア行,連用形-促音便,イウ,言う,言っ,イッ,言う,イウ,和,*,*,*,*,*,*,用,イッ,イウ,イッ,イウ,0,C2,*',
          'て,助詞,接続助詞,*,*,*,*,テ,て,て,テ,て,テ,和,*,*,*,*,*,*,接助,テ,テ,テ,テ,*,動詞%F1,形容詞%F2@-1,*',
        ].map(parseToUniDicToken),
        itta: [
          '言っ,動詞,一般,*,*,五段-ワア行,連用形-促音便,イウ,言う,言っ,イッ,言う,イウ,和,*,*,*,*,*,*,用,イッ,イウ,イッ,イウ,0,C2,*',
          'た,助動詞,*,*,*,助動詞-タ,連体形-一般,タ,た,た,タ,た,タ,和,*,*,*,*,*,*,助動,タ,タ,タ,タ,*,動詞%F2@1,形容詞%F4@-2,*',
        ].map(parseToUniDicToken),
        ieba: [
          '言え,動詞,一般,*,*,五段-ワア行,仮定形-一般,イウ,言う,言え,イエ,言う,イウ,和,*,*,*,*,*,*,用,イエ,イウ,イエ,イウ,0,C2,*',
          'ば,助詞,接続助詞,*,*,*,*,バ,ば,ば,バ,ば,バ,和,*,*,*,*,*,*,接助,バ,バ,バ,バ,*,動詞%F2@0,形容詞%F2@-1,*',
        ].map(parseToUniDicToken),
        iou: [
          '言おう,動詞,一般,*,*,五段-ワア行,意志推量形,イウ,言う,言おう,イオー,言う,イウ,和,*,*,*,*,*,*,用,イオウ,イウ,イオウ,イウ,0,C2,M1@1',
        ].map(parseToUniDicToken),
        iwaseru: [
          '言わ,動詞,一般,*,*,五段-ワア行,未然形-一般,イウ,言う,言わ,イワ,言う,イウ,和,*,*,*,*,*,*,用,イワ,イウ,イワ,イウ,0,C2,*',
          'せる,助動詞,*,*,*,下一段-サ行,連体形-一般,セル,せる,せる,セル,せる,セル,和,*,*,*,*,*,*,助動,セル,セル,セル,セル,*,動詞%F3@1,*',
        ].map(parseToUniDicToken),
        iwareru: [
          '言わ,動詞,一般,*,*,五段-ワア行,未然形-一般,イウ,言う,言わ,イワ,言う,イウ,和,*,*,*,*,*,*,用,イワ,イウ,イワ,イウ,0,C2,*',
          'れる,助動詞,*,*,*,助動詞-レル,連体形-一般,レル,れる,れる,レル,れる,レル,和,*,*,*,*,*,*,助動,レル,レル,レル,レル,*,動詞%F3@1,*',
        ].map(parseToUniDicToken),
        iwaserareru: [
          '言わ,動詞,一般,*,*,五段-ワア行,未然形-一般,イウ,言う,言わ,イワ,言う,イウ,和,*,*,*,*,*,*,用,イワ,イウ,イワ,イウ,0,C2,*',
          'せ,助動詞,*,*,*,下一段-サ行,未然形-一般,セル,せる,せ,セ,せる,セル,和,*,*,*,*,*,*,助動,セ,セル,セ,セル,*,動詞%F3@1,M4@1',
          'られる,助動詞,*,*,*,助動詞-レル,連体形-一般,ラレル,られる,られる,ラレル,られる,ラレル,和,*,*,*,*,*,*,助動,ラレル,ラレル,ラレル,ラレル,*,動詞%F3@2,*',
        ].map(parseToUniDicToken),
      },
    },
  },
} as const;

describe('getPitch', () => {
  describe('suru', () => {
    describe('する', () => {
      test('negative', () => {
        expect(getPitch(unidicData.suru.shinai)).toEqual(0);
      });

      test('polite', () => {
        expect(getPitch(unidicData.suru.shimasu)).toEqual(2);
      });

      test('non-past', () => {
        expect(getPitch(unidicData.suru.suru)).toEqual(0);
      });

      test('gerundive', () => {
        expect(getPitch(unidicData.suru.shite)).toEqual(0);
      });

      test('past', () => {
        expect(getPitch(unidicData.suru.shita)).toEqual(0);
      });

      test('conditional', () => {
        expect(getPitch(unidicData.suru.sureba)).toEqual(2);
      });

      test('volitional', () => {
        expect(getPitch(unidicData.suru.shiyou)).toEqual(2);
      });

      test('causative', () => {
        expect(getPitch(unidicData.suru.saseru)).toEqual(0);
      });

      test('passive', () => {
        expect(getPitch(unidicData.suru.sareru)).toEqual(0);
      });

      test('CP', () => {
        expect(getPitch(unidicData.suru.saserareru)).toEqual(0);
      });
    });
  });

  describe('kuru', () => {
    describe('来る', () => {
      test('negative', () => {
        expect(getPitch(unidicData.kuru.konai)).toEqual(1);
      });

      test('polite', () => {
        expect(getPitch(unidicData.kuru.kimasu)).toEqual(2);
      });

      test('non-past', () => {
        expect(getPitch(unidicData.kuru.kuru)).toEqual(1);
      });

      test('gerundive', () => {
        expect(getPitch(unidicData.kuru.kite)).toEqual(1);
      });

      test('past', () => {
        expect(getPitch(unidicData.kuru.kita)).toEqual(1);
      });

      test('conditional', () => {
        expect(getPitch(unidicData.kuru.kureba)).toEqual(1);
      });

      test('volitional', () => {
        expect(getPitch(unidicData.kuru.koyou)).toEqual(2);
      });

      test('causative', () => {
        expect(getPitch(unidicData.kuru.kosaseru)).toEqual(3);
      });

      test('passive', () => {
        expect(getPitch(unidicData.kuru.korareru)).toEqual(3);
      });

      test('CP', () => {
        expect(getPitch(unidicData.kuru.kosaserareru)).toEqual(5);
      });
    });
  });

  // V-final
  describe('ichidan', () => {
    describe('accented', () => {
      // nakadaka
      describe('晴れる', () => {
        const hareru = unidicData.ichidan.accented.hareru;

        test('negative', () => {
          expect(getPitch(hareru.harenai)).toEqual(2);
        });

        test('polite', () => {
          expect(getPitch(hareru.haremasu)).toEqual(3);
        });

        test('non-past', () => {
          expect(getPitch(hareru.hareru)).toEqual(2);
        });

        test('gerundive', () => {
          expect(getPitch(hareru.harete)).toEqual(1);
        });

        test('past', () => {
          expect(getPitch(hareru.hareta)).toEqual(1);
        });

        test('conditional', () => {
          expect(getPitch(hareru.harereba)).toEqual(2);
        });

        test('volitional', () => {
          expect(getPitch(hareru.hareyou)).toEqual(3);
        });
      });

      // atamadaka
      describe('見る', () => {
        const miru = unidicData.ichidan.accented.miru;
        test('negative', () => {
          expect(getPitch(miru.minai)).toEqual(1);
        });

        test('polite', () => {
          expect(getPitch(miru.mimasu)).toEqual(2);
        });

        test('non-past', () => {
          expect(getPitch(miru.miru)).toEqual(1);
        });

        test('gerundive', () => {
          expect(getPitch(miru.mite)).toEqual(1);
        });

        test('past', () => {
          expect(getPitch(miru.mita)).toEqual(1);
        });

        test('conditional', () => {
          expect(getPitch(miru.mireba)).toEqual(1);
        });

        test('volitional', () => {
          expect(getPitch(miru.miyou)).toEqual(2);
        });

        test('causative', () => {
          expect(getPitch(miru.misaseru)).toEqual(3);
        });

        test('passive', () => {
          expect(getPitch(miru.mirareru)).toEqual(3);
        });

        test('CP', () => {
          expect(getPitch(miru.misaserareru)).toEqual(5);
        });

        describe('accentless auxiliaries', () => {
          describe('simple', () => {
            test('〜に', () => {
              expect(getPitch(miru.mini)).toEqual(1);
            });
            // TODO: this is simply the past tense again; decide how to refactor
            test('〜た', () => {
              expect(getPitch(miru.mita)).toEqual(1);
            });
          });
        });
      });
    });

    describe('unaccented', () => {
      const hareru = unidicData.ichidan.unaccented.hareru;

      describe('腫れる', () => {
        test('negative', () => {
          expect(getPitch(hareru.harenai)).toEqual(0);
        });

        test('polite', () => {
          expect(getPitch(hareru.haremasu)).toEqual(3);
        });

        test('non-past', () => {
          expect(getPitch(hareru.hareru)).toEqual(0);
        });

        test('gerundive', () => {
          expect(getPitch(hareru.harete)).toEqual(0);
        });

        test('past', () => {
          expect(getPitch(hareru.hareta)).toEqual(0);
        });

        test('conditional', () => {
          expect(getPitch(hareru.harereba)).toEqual(3);
        });

        test('volitional', () => {
          expect(getPitch(hareru.hareyou)).toEqual(3);
        });
      });

      describe('始める', () => {
        const hajimeru = unidicData.ichidan.unaccented.hajimeru;
        test('negative', () => {
          expect(getPitch(hajimeru.hajimenai)).toEqual(0);
        });

        test('polite', () => {
          expect(getPitch(hajimeru.hajimemasu)).toEqual(4);
        });

        test('non-past', () => {
          expect(getPitch(hajimeru.hajimeru)).toEqual(0);
        });

        test('gerundive', () => {
          expect(getPitch(hajimeru.hajimete)).toEqual(0);
        });

        test('past', () => {
          expect(getPitch(hajimeru.hajimeta)).toEqual(0);
        });

        test('conditional', () => {
          expect(getPitch(hajimeru.hajimereba)).toEqual(4);
        });

        test('volitional', () => {
          expect(getPitch(hajimeru.hajimeyou)).toEqual(4);
        });

        test('causative', () => {
          expect(getPitch(hajimeru.hajimesaseru)).toEqual(0);
        });

        test('passive', () => {
          expect(getPitch(hajimeru.hajimerareru)).toEqual(0);
        });

        test('CP', () => {
          expect(getPitch(hajimeru.hajimesaserareru)).toEqual(0);
        });
      });
    });
  });

  // C-final
  describe('godan', () => {
    describe('accented', () => {
      describe('喜ぶ', () => {
        const yorokobu = unidicData.godan.accented.yorokobu;

        test('negative', () => {
          expect(getPitch(yorokobu.yorokobanai)).toEqual(4);
        });

        test('polite', () => {
          expect(getPitch(yorokobu.yorokobimasu)).toEqual(5);
        });

        test('non-past', () => {
          expect(getPitch(yorokobu.yorokobu)).toEqual(3);
        });

        test('gerundive', () => {
          expect(getPitch(yorokobu.yorokonde)).toEqual(3);
        });

        test('past', () => {
          expect(getPitch(yorokobu.yorokonda)).toEqual(3);
        });

        test('conditional', () => {
          expect(getPitch(yorokobu.yorokobeba)).toEqual(3);
        });

        test('volitional', () => {
          expect(getPitch(yorokobu.yorokobou)).toEqual(4);
        });
      });

      // nakadaka
      describe('作る', () => {
        const tsukuru = unidicData.godan.accented.tsukuru;
        test('negative', () => {
          expect(getPitch(tsukuru.tsukuranai)).toEqual(3);
        });

        test('polite', () => {
          expect(getPitch(tsukuru.tsukurimasu)).toEqual(4);
        });

        test('non-past', () => {
          expect(getPitch(tsukuru.tsukuru)).toEqual(2);
        });

        test('gerundive', () => {
          expect(getPitch(tsukuru.tsukutte)).toEqual(2);
        });

        test('past', () => {
          expect(getPitch(tsukuru.tsukutta)).toEqual(2);
        });

        test('conditional', () => {
          expect(getPitch(tsukuru.tsukureba)).toEqual(2);
        });

        test('volitional', () => {
          expect(getPitch(tsukuru.tsukurou)).toEqual(3);
        });

        test('causative', () => {
          expect(getPitch(tsukuru.tsukuraseru)).toEqual(4);
        });

        test('passive', () => {
          expect(getPitch(tsukuru.tsukurareru)).toEqual(4);
        });

        test('CP', () => {
          expect(getPitch(tsukuru.tsukuraserareru)).toEqual(6);
        });
      });
    });

    describe('unaccented', () => {
      describe('働く', () => {
        const hataraku = unidicData.godan.unaccented.hataraku;

        test('negative', () => {
          expect(getPitch(hataraku.hatarakanai)).toEqual(0);
        });

        test('polite', () => {
          expect(getPitch(hataraku.hatarakimasu)).toEqual(5);
        });

        test('non-past', () => {
          expect(getPitch(hataraku.hataraku)).toEqual(0);
        });

        test('gerundive', () => {
          expect(getPitch(hataraku.hataraite)).toEqual(0);
        });

        test('past', () => {
          expect(getPitch(hataraku.hataraita)).toEqual(0);
        });

        test('conditional', () => {
          expect(getPitch(hataraku.hatarakeba)).toEqual(4);
        });

        test('volitional', () => {
          expect(getPitch(hataraku.hatarakou)).toEqual(4);
        });
      });
      describe('言う', () => {
        const iu = unidicData.godan.unaccented.iu;

        test('negative', () => {
          expect(getPitch(iu.iwanai)).toEqual(0);
        });

        test('polite', () => {
          expect(getPitch(iu.iimasu)).toEqual(3);
        });

        test('non-past', () => {
          expect(getPitch(iu.iu)).toEqual(0);
        });

        test('gerundive', () => {
          expect(getPitch(iu.itte)).toEqual(0);
        });

        test('past', () => {
          expect(getPitch(iu.itta)).toEqual(0);
        });

        test('conditional', () => {
          expect(getPitch(iu.ieba)).toEqual(1);
        });

        test('volitional', () => {
          expect(getPitch(iu.iou)).toEqual(1);
        });

        test('causative', () => {
          expect(getPitch(iu.iwaseru)).toEqual(0);
        });

        test('passive', () => {
          expect(getPitch(iu.iwareru)).toEqual(0);
        });

        test('CP', () => {
          expect(getPitch(iu.iwaserareru)).toEqual(0);
        });
      });
    });
  });
});
