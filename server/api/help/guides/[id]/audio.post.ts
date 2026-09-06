import { getRouterParam, send, setResponseHeader } from 'h3';
import { applyRateLimit, apiError, defineApiHandler, readValidatedJsonBody } from '../../../../utils/errors';
import { generateSpeech } from '../../../../utils/elevenlabs';
import { translateGuide } from '../../../../utils/gemini';
import { createNarrationText } from '../../../../utils/narration';
import { getGuide } from '../../../../utils/snowflake';
import { audioRequestSchema, parseHelpId } from '../../../../types/help';

const audioCache = new Map<string, Buffer>();

export default defineApiHandler(async (event) => {
  applyRateLimit(event, 'help:audio', 10, 15 * 60_000);

  const id = parseHelpId(getRouterParam(event, 'id'));

  if (!id) {
    throw apiError(400, 'INVALID_HELP_ID', 'Please provide a valid guide ID.');
  }

  const body = await readValidatedJsonBody(event, audioRequestSchema);
  const cacheKey = `${id}:${body.language}`;
  const cached = audioCache.get(cacheKey);

  if (cached) {
    setResponseHeader(event, 'cache-control', 'private, max-age=300');
    return send(event, cached, 'audio/mpeg');
  }

  const guide = await getGuide(event, id);

  if (!guide) {
    throw apiError(404, 'HELP_GUIDE_NOT_FOUND', 'Guide not found.');
  }

  const narration = createNarrationText(guide);
  const translatedNarration = await translateGuide(event, narration, body.language);
  const audio = await generateSpeech(event, translatedNarration);

  audioCache.set(cacheKey, audio);
  setResponseHeader(event, 'cache-control', 'private, max-age=300');

  return send(event, audio, 'audio/mpeg');
});
