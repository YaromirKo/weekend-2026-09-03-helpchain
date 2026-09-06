import { z } from 'zod';
import type {
  GlobalHelpImpact,
  GuideStep,
  HelpGuide,
  HelpImpact,
  HelpRequest,
  HelpSearchResult,
} from '../../shared/types/help';

export type {
  GlobalHelpImpact,
  GuideStep,
  HelpGuide,
  HelpImpact,
  HelpRequest,
  HelpSearchResult,
};

export const HELPED_EVENT_TYPE = 'HELPED';
export const DEFAULT_SEARCH_THRESHOLD = 0.55;
export const DEFAULT_MAX_VIDEO_BYTES = 20 * 1024 * 1024;

export const supportedVideoMimeTypes = ['video/mp4', 'video/webm'] as const;

const helpIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-zA-Z0-9_-]+$/);

const optionalShortText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : undefined));

export const idParamSchema = z.object({
  id: helpIdSchema,
});

export function parseHelpId(value: unknown) {
  const parsed = helpIdSchema.safeParse(value);

  if (!parsed.success) {
    return null;
  }

  return parsed.data;
}

export const createHelpRequestSchema = z.object({
  title: z.string().trim().min(1).max(150),
  description: z.string().trim().min(1).max(2000),
  category: z.string().trim().min(1).max(80),
  askedBy: optionalShortText(80),
});

export const searchHelpSchema = z.object({
  query: z.string().trim().min(1).max(500),
});

export const processHelpSchema = z.object({
  requestId: helpIdSchema,
  helperName: z.string().trim().min(1).max(80),
});

export const processHelperNameSchema = z.object({
  helperName: z.string().trim().min(1).max(80),
});

export const audioRequestSchema = z.object({
  language: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z]{2,3}(-[a-z0-9]{2,8})?$/i)
    .default('en'),
});

export const helpedEventSchema = z.object({
  anonymousId: z.string().trim().min(1).max(120),
  displayName: optionalShortText(80),
  language: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z]{2,3}(-[a-z0-9]{2,8})?$/i)
    .default('en'),
});

export const guideStepSchema = z.object({
  order: z.coerce.number().int().positive(),
  title: z.string().trim().min(1).max(120),
  action: z.string().trim().min(1).max(700),
  startTime: z.coerce.number().finite().min(0),
  endTime: z.coerce.number().finite().positive(),
}).refine((step) => step.endTime > step.startTime, {
  message: 'endTime must be greater than startTime',
  path: ['endTime'],
});

export const processedGuideSchema = z.object({
  title: z.string().trim().min(1).max(150),
  summary: z.string().trim().min(1).max(700),
  materials: z.array(z.string().trim().min(1).max(120)).max(20).default([]),
  steps: z.array(guideStepSchema).min(1).max(20),
}).transform((guide) => ({
  ...guide,
  materials: guide.materials.filter(Boolean),
  steps: [...guide.steps].sort((a, b) => a.order - b.order),
}));

export type CreateHelpRequestInput = z.infer<typeof createHelpRequestSchema>;
export type SearchHelpInput = z.infer<typeof searchHelpSchema>;
export type ProcessHelpInput = z.infer<typeof processHelpSchema>;
export type AudioRequestInput = z.infer<typeof audioRequestSchema>;
export type HelpedEventInput = z.infer<typeof helpedEventSchema>;
export type ProcessedGuideContent = z.infer<typeof processedGuideSchema>;
