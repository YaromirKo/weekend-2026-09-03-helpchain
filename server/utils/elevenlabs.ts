import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { Buffer } from 'node:buffer';
import type { H3Event } from 'h3';
import { apiError, withTimeout } from './errors';

let elevenLabsClient: ElevenLabsClient | undefined;
let elevenLabsApiKey: string | undefined;

function getElevenLabsClient(event: H3Event) {
  const config = useRuntimeConfig(event);
  const apiKey = String(config.elevenlabs?.apiKey || '');

  if (!apiKey) {
    throw apiError(503, 'ELEVENLABS_NOT_CONFIGURED', 'ElevenLabs is not configured.');
  }

  if (!elevenLabsClient || elevenLabsApiKey !== apiKey) {
    elevenLabsClient = new ElevenLabsClient({
      apiKey,
      timeoutInSeconds: 30,
      maxRetries: 1,
    });
    elevenLabsApiKey = apiKey;
  }

  return elevenLabsClient;
}

export async function generateSpeech(event: H3Event, text: string) {
  const config = useRuntimeConfig(event);
  const voiceId = String(config.elevenlabs?.voiceId || '');

  if (!voiceId) {
    throw apiError(503, 'ELEVENLABS_VOICE_NOT_CONFIGURED', 'ElevenLabs voice is not configured.');
  }

  try {
    return await withTimeout(
      (async () => {
        const audioStream = await getElevenLabsClient(event).textToSpeech.convert(voiceId, {
          text: text.slice(0, 4000),
          modelId: 'eleven_multilingual_v2',
          outputFormat: 'mp3_44100_128',
        });

        return readStreamToBuffer(audioStream);
      })(),
      30_000,
      'ELEVENLABS_TIMEOUT',
      "We couldn't generate guide audio in time.",
    );
  } catch (error) {
    if (error instanceof Error && error.name === 'ApiRouteError') {
      throw error;
    }

    console.error('ElevenLabs speech generation failed', error);
    throw apiError(502, 'AUDIO_GENERATION_FAILED', "We couldn't generate guide audio.");
  }
}

async function readStreamToBuffer(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const chunks: Buffer[] = [];

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    chunks.push(Buffer.from(value));
  }

  return Buffer.concat(chunks);
}
