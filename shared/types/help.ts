export interface HelpRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  askedBy?: string;
  status: 'open' | 'processed';
  createdAt: string;
}

export interface GuideStep {
  order: number;
  title: string;
  action: string;
  startTime: number;
  endTime: number;
}

export interface HelpGuide {
  id: string;
  requestId: string;
  title: string;
  summary: string;
  helperName: string;
  originalRecipient?: string;
  materials: string[];
  steps: GuideStep[];
  searchableText: string;
  createdAt: string;
}

export interface HelpSearchResult {
  guideId: string;
  title: string;
  summary: string;
  helperName: string;
  relevance: number;
  peopleHelped: number;
  languagesReached: number;
}

export interface HelpImpact {
  peopleHelped: number;
  languagesReached: number;
  recipients: Array<{
    anonymousId: string;
    displayName?: string;
  }>;
}

export interface GlobalHelpImpact {
  peopleHelped: number;
  humanSolutions: number;
  languagesReached: number;
}
