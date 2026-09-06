export type HelpRequestSummary = {
  id: string;
  routePath: string;
  question: string;
  askedBy: string;
  category: string;
  status: string;
  detail: string;
  helperNudge: string;
  iconPath: string;
  illustrationPaths: string[];
  accentColor: string;
  washColor: string;
};

export type GuideStepData = {
  id: string;
  number: string;
  title: string;
  description: string;
  timeRange: string;
  momentLabel: string;
};

export type ProcessingStepData = {
  label: string;
  provider?: string;
  symbol: '✓' | '●' | '○';
  status: 'complete' | 'active' | 'queued';
};

export type SearchResultGuide = {
  title: string;
  helperName: string;
  helperInitial: string;
  helpedCount: number;
  languages: number;
  matchPercent: number;
  duration: string;
  query: string;
  summary: string;
  routePath: string;
};

export type ReusableGuide = {
  id: string;
  badge: string;
  title: string;
  supportingLine: string;
  helperName: string;
  helperInitial: string;
  originalRecipient: string;
  duration: string;
  helpedCount: number;
  languages: number;
  matchPercent: number;
  matchText: string;
  materials: string[];
  steps: GuideStepData[];
};

export const featuredSearchQuery =
  'My houseplant leaves keep turning yellow and the dirt never dries.';

export const searchResultGuide: SearchResultGuide = {
  title: 'Recovering an overwatered pothos',
  helperName: 'John',
  helperInitial: 'J',
  helpedCount: 18,
  languages: 3,
  matchPercent: 92,
  duration: '0:27',
  query: featuredSearchQuery,
  summary:
    'John showed how he checks the roots, lets the soil dry, and changes the watering rhythm before the plant declines further.',
  routePath: '/guide/1',
};

export const openRequest: HelpRequestSummary = {
  id: '1',
  routePath: '/request/1',
  question: 'How do I make a slip knot without it collapsing?',
  askedBy: 'Anna',
  category: 'Crafts',
  status: 'Needs help',
  detail: 'The loop falls apart when Anna tightens it before starting a scarf.',
  helperNudge: 'A close-up hand demonstration would solve this quickly.',
  iconPath: 'M7 7c5 7 13 7 18 0M10 20c4-8 12-8 16 0M13 13h10',
  illustrationPaths: [
    'M62 88c31-40 88-37 104 0 12 28-19 54-48 31-23-19 4-56 42-41',
    'M86 118c-18 18-35 31-55 40',
    'M152 119c20 17 34 31 49 48',
  ],
  accentColor: '#0f5b49',
  washColor: '#e7f4ee',
};

export const openRequests: HelpRequestSummary[] = [
  openRequest,
  {
    id: 'origami-corner',
    routePath: '/request/1',
    question: 'How do I fold an origami corner so both edges line up?',
    askedBy: 'Niko',
    category: 'Paper',
    status: 'Needs help',
    detail: 'One side always ends up longer after the first fold.',
    helperNudge: 'A slow overhead fold would make the angle obvious.',
    iconPath: 'M7 7h20L13 27 7 7Zm6 20 4-10 10-10',
    illustrationPaths: [
      'M48 162 118 45l70 117H48Z',
      'M118 45v117',
      'M48 162l70-52 70 52',
    ],
    accentColor: '#bf5b48',
    washColor: '#fae7df',
  },
  {
    id: 'shirt-button',
    routePath: '/request/1',
    question: 'How do I fix a loose shirt button before it falls off?',
    askedBy: 'Ana',
    category: 'Sewing',
    status: 'Needs help',
    detail: 'The needle is threaded, but the button will not stay secure.',
    helperNudge: 'Someone could show the knot and stitch tension.',
    iconPath: 'M17 7v20M7 17h20M11 11l12 12M23 11 11 23',
    illustrationPaths: [
      'M83 65h82v82H83z',
      'M103 85h42M103 105h42M103 125h42',
      'M58 172c32-42 94-38 132-2',
    ],
    accentColor: '#c8892f',
    washColor: '#f8ecd2',
  },
];

export const reusableGuide: ReusableGuide = {
  id: '1',
  badge: 'Human-created help',
  title: 'How to make a slip knot that stays secure',
  supportingLine: 'John originally recorded this 27-second answer to help Anna.',
  helperName: 'John',
  helperInitial: 'J',
  originalRecipient: 'Anna',
  duration: '0:27',
  helpedCount: 18,
  languages: 3,
  matchPercent: 92,
  matchText: 'Someone had already helped with something similar.',
  materials: ['Yarn'],
  steps: [
    {
      id: 'first-loop',
      number: '01',
      title: 'Create the first loop',
      description: 'Hold the working yarn and cross it over the tail.',
      timeRange: '00:03 → 00:08',
      momentLabel: 'Show this moment',
    },
    {
      id: 'pull-through',
      number: '02',
      title: 'Pull the yarn through',
      description: 'Guide a section of working yarn through the loop.',
      timeRange: '00:08 → 00:15',
      momentLabel: 'Show this moment',
    },
    {
      id: 'tighten',
      number: '03',
      title: 'Tighten the knot',
      description: 'Pull the loop while holding the tail.',
      timeRange: '00:15 → 00:22',
      momentLabel: 'Show this moment',
    },
  ],
};

export const processingSteps: ProcessingStepData[] = [
  {
    label: 'Human answer received',
    symbol: '✓',
    status: 'complete',
  },
  {
    label: 'Understanding the demonstration',
    provider: 'Google Gemini',
    symbol: '✓',
    status: 'complete',
  },
  {
    label: 'Finding important moments',
    symbol: '●',
    status: 'active',
  },
  {
    label: 'Creating reusable steps',
    symbol: '○',
    status: 'queued',
  },
  {
    label: 'Preparing accessible narration',
    provider: 'ElevenLabs',
    symbol: '○',
    status: 'queued',
  },
  {
    label: 'Adding the help to the reusable knowledge library',
    provider: 'Snowflake',
    symbol: '○',
    status: 'queued',
  },
];

export const sponsorMoments = [
  {
    label: 'Understanding the demonstration',
    provider: 'Google Gemini',
    text: "Finds the important motions in John's answer.",
  },
  {
    label: 'Making the guide listenable',
    provider: 'ElevenLabs',
    text: 'Turns the same human help into calm spoken guidance.',
  },
  {
    label: 'Finding previously donated knowledge',
    provider: 'Snowflake',
    text: 'Surfaces similar human-created answers when someone searches.',
  },
] as const;
