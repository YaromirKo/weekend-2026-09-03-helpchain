import type { HelpGuide } from '../types/help';

const numberWords = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty',
];

export function createNarrationText(guide: HelpGuide) {
  const stepLines = guide.steps.flatMap((step, index) => {
    const stepNumber = numberWords[index + 1] || String(index + 1);

    return [
      `Step ${stepNumber}. ${step.title}.`,
      step.action,
    ];
  });

  return [
    `${guide.title}.`,
    guide.summary,
    ...stepLines,
  ]
    .filter(Boolean)
    .join('\n\n');
}
