# Pitch Accent

A library to predict pitch accent in Japanese.

# Usage

## For users

Installation:

```sh
yarn install pitch-accent
```

Usage:

```ts
import { solve } from "pitch-accent";

solve([
  { surface: 'シン', pos: 'noun', accent: 1 },
  { surface: 'タマネギ', pos: 'noun', accent: 3 },
])
// 5

solve([
  { surface: 'シン', pos: 'noun', accent: 1 },
  { surface: 'ヨコハマ', pos: 'noun', accent: 0 },
]);
// 3
```

## For contributors

```sh
# Install deps
yarn install

# Run
yarn start
```

# Licence

`pitch-accent` is copyrighted free software by Jamie Birch, and is released under any of the BSD, LGPL, or GPL licences (see the files LICENCE-BSD.txt, LICENCE-LGPL.txt, and LICENCE-GPL.txt, respectively).

Algorithms used in this program are based on [@PhoneticsKeio](https://twitter.com/PhoneticsKeio)'s excellent review:

> Kawahara, Shigeto. "11 The phonology of Japanese accent". Handbook of Japanese Phonetics and Phonology, edited by Haruo Kubozono, Berlin, München, Boston: De Gruyter Mouton, 2015, pp. 445-492. https://doi.org/10.1515/9781614511984.445
