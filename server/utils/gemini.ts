import { GoogleGenAI, createPartFromBase64 } from '@google/genai';
import { Buffer } from 'node:buffer';
import type { H3Event } from 'h3';
import type { HelpRequest, ProcessedGuideContent } from '../types/help';
import { processedGuideSchema } from '../types/help';
import { apiError, withTimeout } from './errors';

let geminiClient: GoogleGenAI | undefined;
let geminiApiKey: string | undefined;

type VideoInput = {
  data: Buffer;
  mimeType: string;
};

function getGeminiClient(event: H3Event) {
  const config = useRuntimeConfig(event);
  const apiKey = String(config.gemini?.apiKey || '');

  if (!apiKey) {
    throw apiError(503, 'GEMINI_NOT_CONFIGURED', 'Gemini is not configured.');
  }

  if (!geminiClient || geminiApiKey !== apiKey) {
    geminiClient = new GoogleGenAI({ apiKey });
    geminiApiKey = apiKey;
  }

  return geminiClient;
}

function getGeminiModel(event: H3Event) {
  const config = useRuntimeConfig(event);
  return String(config.gemini?.model || 'gemini-3.8-flash');
}

export async function processHumanHelpVideo(
  event: H3Event,
  request: HelpRequest,
  video: VideoInput,
): Promise<ProcessedGuideContent> {
  const prompt = [
    "You are preserving a human helper's demonstration as reusable instructions.",
    '',
    'A person asked this question:',
    '',
    'TITLE:',
    request.title,
    '',
    'DESCRIPTION:',
    request.description,
    '',
    "The attached video is a HUMAN helper's answer.",
    '',
    'Your job is to describe and structure what the human demonstrates.',
    '',
    'IMPORTANT RULES:',
    '',
    '- Do not replace the helper with your own solution.',
    '- Do not invent steps that are not visible or clearly explained.',
    '- Do not add unrelated advice.',
    "- Preserve the helper's demonstrated method.",
    '- Extract clear chronological steps.',
    '- Identify approximate timestamps for each step.',
    '- Keep instructions concise.',
    '- Only list materials that are visible or explicitly mentioned.',
    '',
    'Return only JSON with this shape:',
    '{"title":"string","summary":"string","materials":["string"],"steps":[{"order":1,"title":"string","action":"string","startTime":0,"endTime":1}]}',
  ].join('\n');

  const response = await withTimeout(
    getGeminiClient(event).models.generateContent({
      model: getGeminiModel(event),
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            createPartFromBase64(video.data.toString('base64'), video.mimeType),
          ],
        },
      ],
      config: {
        temperature: 0.1,
        responseMimeType: 'application/json',
        responseJsonSchema: {
          type: 'object',
          required: ['title', 'summary', 'materials', 'steps'],
          properties: {
            title: { type: 'string' },
            summary: { type: 'string' },
            materials: {
              type: 'array',
              items: { type: 'string' },
            },
            steps: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                required: ['order', 'title', 'action', 'startTime', 'endTime'],
                properties: {
                  order: { type: 'number' },
                  title: { type: 'string' },
                  action: { type: 'string' },
                  startTime: { type: 'number' },
                  endTime: { type: 'number' },
                },
              },
            },
          },
        },
      },
    }),
    45_000,
    'GEMINI_TIMEOUT',
    "We couldn't turn this demonstration into reusable help in time.",
  );

  const text = response.text;

  if (!text) {
    throw apiError(502, 'VIDEO_PROCESSING_FAILED', "We couldn't turn this demonstration into reusable help.");
  }

  try {
    return processedGuideSchema.parse(parseJsonObject(text));
  } catch (error) {
    console.error('Gemini returned invalid guide JSON', error);
    throw apiError(502, 'VIDEO_PROCESSING_FAILED', "We couldn't turn this demonstration into reusable help.");
  }
}

export async function translateGuide(
  event: H3Event,
  text: string,
  language: string,
) {
  if (language === 'en') {
    return text;
  }

  const prompt = [
    'Translate the following human-created help narration.',
    '',
    'Rules:',
    '- Preserve the meaning exactly.',
    '- Do not add steps.',
    '- Do not remove steps.',
    '- Do not expand the advice.',
    '- Return only the translated narration text.',
    '',
    `Target language code: ${language}`,
    '',
    'Narration:',
    text,
  ].join('\n');

  const response = await withTimeout(
    getGeminiClient(event).models.generateContent({
      model: getGeminiModel(event),
      contents: prompt,
      config: {
        temperature: 0,
        responseMimeType: 'text/plain',
      },
    }),
    20_000,
    'GEMINI_TRANSLATION_TIMEOUT',
    "We couldn't translate this guide in time.",
  );

  const translated = response.text?.trim();

  if (!translated) {
    throw apiError(502, 'GUIDE_TRANSLATION_FAILED', "We couldn't translate this guide.");
  }

  return translated;
}

function parseJsonObject(text: string) {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const withoutFence = trimmed
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    try {
      return JSON.parse(withoutFence);
    } catch {
      const start = withoutFence.indexOf('{');
      const end = withoutFence.lastIndexOf('}');

      if (start >= 0 && end > start) {
        return JSON.parse(withoutFence.slice(start, end + 1));
      }

      throw new Error('No JSON object found');
    }
  }
}
