import type {
  GlobalHelpImpact,
  GuideStep,
  HelpGuide,
  HelpImpact,
  HelpRequest,
  HelpSearchResult,
} from '../../shared/types/help';

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
  guideId: string;
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
  recipients: HelpImpact['recipients'];
};

export type {
  GlobalHelpImpact,
  HelpGuide,
  HelpImpact,
  HelpRequest,
  HelpSearchResult,
};

export const seededGuideId = 'guide-pothos-overwatered';
export const seededOpenRequestId = 'request-slip-knot';

export const featuredSearchQuery =
  'My houseplant leaves keep turning yellow and the dirt never dries.';

export const searchResultGuide: SearchResultGuide = {
  guideId: seededGuideId,
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
  routePath: `/guide/${seededGuideId}`,
};

export const openRequest: HelpRequestSummary = {
  id: seededOpenRequestId,
  routePath: `/request/${seededOpenRequestId}`,
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
    routePath: `/request/${seededOpenRequestId}`,
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
    routePath: `/request/${seededOpenRequestId}`,
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
  id: seededGuideId,
  badge: 'Shared by John',
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
  recipients: [
    { anonymousId: 'seed-person-001', displayName: 'Anna' },
    { anonymousId: 'seed-person-002', displayName: 'Carlos' },
    { anonymousId: 'seed-person-003', displayName: 'Mei' },
  ],
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

const requestVisuals: Record<string, Pick<HelpRequestSummary, 'iconPath' | 'illustrationPaths' | 'accentColor' | 'washColor' | 'helperNudge'>> = {
  crafts: {
    iconPath: openRequest.iconPath,
    illustrationPaths: openRequest.illustrationPaths,
    accentColor: openRequest.accentColor,
    washColor: openRequest.washColor,
    helperNudge: 'A close-up hand demonstration would solve this quickly.',
  },
  plants: {
    iconPath: 'M10 25c9-1 13-8 12-18M16 25c-5-7-4-14 4-19M18 17c-6 0-10-3-12-8M19 15c7 1 11-2 13-8',
    illustrationPaths: [
      'M116 176c-3-44 2-86 18-126',
      'M126 108c-32-12-52-34-62-66 34 5 57 24 68 57',
      'M136 96c32-20 63-25 94-15-18 29-47 42-86 38',
    ],
    accentColor: '#0f5b49',
    washColor: '#e7f4ee',
    helperNudge: 'A short visual check can show what is wrong.',
  },
  repairs: {
    iconPath: 'M9 23 23 9M19 7l6 6M7 25l6-1 12-12-5-5L8 19l-1 6Z',
    illustrationPaths: [
      'M66 150 158 58',
      'M144 44l54 54',
      'M82 168l-34 10 10-34',
    ],
    accentColor: '#bf5b48',
    washColor: '#fae7df',
    helperNudge: 'A quick demonstration could prevent trial and error.',
  },
};

export const defaultGlobalImpact: GlobalHelpImpact = {
  peopleHelped: 18,
  humanSolutions: 1,
  languagesReached: 3,
};

export const defaultGuideImpact: HelpImpact = {
  peopleHelped: reusableGuide.helpedCount,
  languagesReached: reusableGuide.languages,
  recipients: [
    { anonymousId: 'seed-person-001', displayName: 'Anna' },
    { anonymousId: 'seed-person-002', displayName: 'Carlos' },
    { anonymousId: 'seed-person-003', displayName: 'Mei' },
  ],
};

export function mapHelpRequestToSummary(request: HelpRequest): HelpRequestSummary {
  const categoryKey = request.category.trim().toLowerCase();
  const visuals = requestVisuals[categoryKey] || requestVisuals.crafts;
  const askedBy = request.askedBy || 'Someone';

  return {
    id: request.id,
    routePath: `/request/${request.id}`,
    question: request.title,
    askedBy,
    category: request.category,
    status: request.status === 'open' ? 'Needs help' : 'Processed',
    detail: request.description,
    helperNudge: visuals.helperNudge,
    iconPath: visuals.iconPath,
    illustrationPaths: visuals.illustrationPaths,
    accentColor: visuals.accentColor,
    washColor: visuals.washColor,
  };
}

export function mapSearchResultToGuide(result: HelpSearchResult): SearchResultGuide {
  const matchPercent = Math.max(0, Math.round(result.relevance * 100));

  return {
    guideId: result.guideId,
    title: result.title,
    helperName: result.helperName || 'A helper',
    helperInitial: getInitial(result.helperName),
    helpedCount: result.peopleHelped,
    languages: result.languagesReached,
    matchPercent,
    duration: 'Guide',
    query: featuredSearchQuery,
    summary: result.summary,
    routePath: `/guide/${result.guideId}?match=${matchPercent}`,
  };
}

export function mapHelpGuideToReusableGuide(
  guide: HelpGuide,
  impact: HelpImpact = defaultGuideImpact,
  matchPercent = 0,
): ReusableGuide {
  const duration = formatDuration(getGuideDuration(guide.steps));
  const originalRecipient = guide.originalRecipient || 'someone';

  return {
    id: guide.id,
    badge: `Shared by ${guide.helperName}`,
    title: guide.title,
    supportingLine: `${guide.helperName} originally recorded this answer to help ${originalRecipient}.`,
    helperName: guide.helperName,
    helperInitial: getInitial(guide.helperName),
    originalRecipient,
    duration,
    helpedCount: impact.peopleHelped,
    languages: impact.languagesReached,
    matchPercent,
    matchText: 'Someone had already helped with something similar.',
    materials: guide.materials,
    steps: guide.steps.map((step) => mapGuideStep(guide.id, step)),
    recipients: impact.recipients,
  };
}

export function formatDuration(seconds: number) {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

function mapGuideStep(guideId: string, step: GuideStep): GuideStepData {
  return {
    id: `${guideId}-step-${step.order}`,
    number: String(step.order).padStart(2, '0'),
    title: step.title,
    description: step.action,
    timeRange: `${formatDuration(step.startTime)} -> ${formatDuration(step.endTime)}`,
    momentLabel: 'Show this moment',
  };
}

function getGuideDuration(steps: GuideStep[]) {
  return steps.reduce((duration, step) => Math.max(duration, step.endTime), 0);
}

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || 'H';
}

export const processingSteps: ProcessingStepData[] = [
  {
    label: "Helper's answer received",
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
    text: "Finds the important motions in the helper's answer.",
  },
  {
    label: 'Making the guide listenable',
    provider: 'ElevenLabs',
    text: 'Turns the same answer into calm spoken guidance.',
  },
  {
    label: 'Finding previously donated knowledge',
    provider: 'Snowflake',
    text: 'Surfaces similar shared answers when someone searches.',
  },
] as const;
