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

# Legal

`pitch-accent` is copyrighted free software by Jamie Birch, and is released under any of the BSD, LGPL, or GPL licences (see the files LICENCE-BSD.txt, LICENCE-LGPL.txt, and LICENCE-GPL.txt, respectively).

See `sources.md` for source data used.
