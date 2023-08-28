/** @type {Array<[surface: string, predictions: import('../src/inflection').PitchPredictions]>} */
const data = [
  ['書きます', [{ confidence: 'high', reason: 'NHK 4.1', accent: [3] }]],
  ['書きたい', [{ confidence: 'high', reason: 'NHK 2', accent: [3] }]],
  ['書きそうだ', [{ confidence: 'high', reason: 'NHK 2', accent: [3] }]],
  ['書きながら', [{ confidence: 'high', reason: 'NHK 2', accent: [3] }]],
  ['書きは', null],
  ['書く', [{ confidence: 'verified', reason: 'Dictionary', accent: [1] }]],
  ['書くだけ', [{ confidence: 'high', reason: 'NHK 1.1.a', accent: [1] }]],
  ['書くほど', [{ confidence: 'high', reason: 'NHK 1.1.a', accent: [1] }]],
  ['書くけれども', [{ confidence: 'high', reason: 'NHK 1.1.b', accent: [1] }]],
  ['書くが', [{ confidence: 'high', reason: 'NHK 1.1.b', accent: [1] }]],
  ['書くから', [{ confidence: 'high', reason: 'NHK 1.1.b', accent: [1] }]],
  ['書くけれど', [{ confidence: 'high', reason: 'NHK 1.1.b', accent: [1] }]],
  ['書くし', [{ confidence: 'high', reason: 'NHK 1.1.b', accent: [1] }]],
  ['書くって', [{ confidence: 'high', reason: 'NHK 1.1.b', accent: [1] }]],
  ['書くと', [{ confidence: 'high', reason: 'NHK 1.1.b', accent: [1] }]],
  ['書くなら', [{ confidence: 'high', reason: 'NHK 1.1.b', accent: [1] }]],
  ['書くしか', [{ confidence: 'high', reason: 'NHK 1.1.b', accent: [1] }]],
  ['書くのだ', [{ confidence: 'high', reason: 'NHK 1.1.b', accent: [1] }]],
  ['書くので', [{ confidence: 'high', reason: 'NHK 1.1.b', accent: [1] }]],
  ['書くそうだ', [{ confidence: 'high', reason: 'NHK 1.2.a', accent: [1, 3] }]],
  [
    '書くみたいだ',
    [{ confidence: 'high', reason: 'NHK 1.2.a', accent: [1, 3] }],
  ],
  ['書くらしい', [{ confidence: 'high', reason: 'NHK 1.2.a', accent: [1, 4] }]],
  [
    '書くどころか',
    [
      { confidence: 'high', reason: 'NHK 1.2.a', accent: [3] },
      { confidence: 'high', reason: 'NHK 1.2.a', accent: [1, 3] },
    ],
  ],
  ['書くようだ', [{ confidence: 'high', reason: 'NHK 1.2.a', accent: [1, 3] }]],
  [
    '書くぐらい',
    [
      { confidence: 'high', reason: 'NHK 1.2.a', accent: [3] },
      { confidence: 'high', reason: 'NHK 1.2.a', accent: [1, 3] },
    ],
  ],
  [
    '書くくらい',
    [
      { confidence: 'high', reason: 'NHK 1.2.a', accent: [3] },
      { confidence: 'high', reason: 'NHK 1.2.a', accent: [1, 3] },
    ],
  ],
  ['書くばかり', [{ confidence: 'high', reason: 'NHK 1.2.a', accent: [1, 3] }]],
  ['書くまで', [{ confidence: 'high', reason: 'NHK 1.2.a', accent: [1, 3] }]],
  ['書くだろう', [{ confidence: 'high', reason: 'NHK 1.2.b', accent: [1, 4] }]],
  [
    '書くでしょう',
    [{ confidence: 'high', reason: 'NHK 1.2.b', accent: [1, 4] }],
  ],
  ['書いて', [{ confidence: 'high', reason: 'NHK 1.1.a', accent: [1] }]],
  ['書いた', [{ confidence: 'high', reason: 'NHK 1.1.a', accent: [1] }]],
  ['書かない', [{ confidence: 'high', reason: 'NHK 3.1', accent: [2] }]],
  ['書けば', [{ confidence: 'high', reason: 'NHK 1.1.b', accent: [1] }]],
  ['書け', [{ confidence: 'verified', reason: 'Dictionary', accent: [1] }]],
  ['書ける', [{ confidence: 'verified', reason: 'Dictionary', accent: [2] }]],
  ['書かれる', [{ confidence: 'high', reason: 'NHK 2', accent: [3] }]],
  ['書かせる', [{ confidence: 'high', reason: 'NHK 2', accent: [3] }]],
  ['書こう', [{ confidence: 'high', reason: 'NHK 4.1', accent: [2] }]],
  ['書かせられる', [{ confidence: 'high', reason: 'NHK 2', accent: [5] }]],
].filter(([, predictions]) => !!predictions);

const table = document.createElement('table');
const tbody = document.createElement('tbody');
table.append(tbody);

const headerRow = document.createElement('tr');
tbody.append(headerRow);
[
  'Form',
  'Pitch',
  'Source',
  // 'Confidence'
].forEach((title) => {
  const th = document.createElement('th');
  th.textContent = title;
  headerRow.append(th);
});

for (const [surface, predictions] of data) {
  // Crude, but sufficient for this static data
  const pron = surface.replace('書', 'か');

  const rows = predictions.map(({ accent, confidence, reason }) => {
    let diagram = pron;

    if (accent.includes(0)) {
      return { diagram: `／${diagram}`, confidence, reason };
    }

    for (const [i, downstep] of [...accent].sort().entries()) {
      const next = [...diagram];
      next.splice(downstep + i, 0, '＼');
      diagram = next.join('');
    }

    return { diagram, confidence, reason };
  });

  for (const [i, { diagram, reason }] of rows.entries()) {
    const tr = document.createElement('tr');
    const formCell = document.createElement('td');
    formCell.textContent = i ? '' : surface;

    const pitchCell = document.createElement('td');

    const spanContainer = document.createElement('span');
    for (const split of diagram.split(/(?=[＼／])/g)) {
      let text = split;
      if (/^[＼／]/.test(split)) {
        const span = document.createElement('span');
        span.textContent = [...split][0];
        span.classList.add('tone');
        text = [...text].slice(1).join('');
        spanContainer.append(span);
      }

      if (!text) {
        continue;
      }

      spanContainer.append(
        document.createTextNode(
          text.replace('く', 'く・').replace(/く・$/, 'く')
        )
      );
    }
    spanContainer.normalize();
    pitchCell.append(spanContainer);

    const sourceCell = document.createElement('td');
    sourceCell.textContent = reason;

    // const confidenceCell = document.createElement('td');
    // confidenceCell.textContent = confidence;

    tr.append(formCell, pitchCell, sourceCell);
    tbody.append(tr);
  }
}

document.body.append(table);
