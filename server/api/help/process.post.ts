import { getRequestHeader, readMultipartFormData, setResponseStatus } from 'h3';
import {
  apiError,
  applyRateLimit,
  defineApiHandler,
  requireMultipartContentType,
} from '../../utils/errors';
import { processHumanHelpVideo } from '../../utils/gemini';
import { getHelpRequest, saveGuide } from '../../utils/snowflake';
import {
  DEFAULT_MAX_VIDEO_BYTES,
  parseHelpId,
  processHelperNameSchema,
  supportedVideoMimeTypes,
} from '../../types/help';

export default defineApiHandler(async (event) => {
  applyRateLimit(event, 'help:process', 5, 15 * 60_000);
  requireMultipartContentType(event);

  const config = useRuntimeConfig(event);
  const maxVideoBytes = Number(config.help?.maxVideoBytes || DEFAULT_MAX_VIDEO_BYTES);
  const uploadLimit = Number.isFinite(maxVideoBytes) ? maxVideoBytes : DEFAULT_MAX_VIDEO_BYTES;
  const contentLength = Number(getRequestHeader(event, 'content-length') || 0);

  if (Number.isFinite(contentLength) && contentLength > uploadLimit + 256 * 1024) {
    throw apiError(413, 'VIDEO_TOO_LARGE', 'Please upload a video smaller than 20 MB.');
  }

  const formData = await readMultipartFormData(event);

  if (!formData) {
    throw apiError(400, 'INVALID_MULTIPART_BODY', 'Please upload a supported short video.');
  }

  const field = (name: string) =>
    formData.find((part) => part.name === name && !part.filename)?.data.toString('utf8').trim();
  const video = formData.find((part) => part.name === 'video' && part.filename);

  const requestId = parseHelpId(field('requestId'));
  const helperName = field('helperName');

  if (!requestId) {
    throw apiError(400, 'INVALID_HELP_ID', 'Please provide a valid help request ID.');
  }

  const input = processHelperNameSchema.parse({ helperName });

  if (!video || !video.type || !supportedVideoMimeTypes.includes(video.type as typeof supportedVideoMimeTypes[number])) {
    throw apiError(400, 'INVALID_VIDEO', 'Please upload a supported short video.');
  }

  if (video.data.byteLength > uploadLimit) {
    throw apiError(413, 'VIDEO_TOO_LARGE', 'Please upload a video smaller than 20 MB.');
  }

  const request = await getHelpRequest(event, requestId);

  if (!request) {
    throw apiError(404, 'HELP_REQUEST_NOT_FOUND', 'Help request not found.');
  }

  if (request.status === 'processed') {
    throw apiError(409, 'HELP_REQUEST_ALREADY_PROCESSED', 'This help request has already been processed.');
  }

  const processedGuide = await processHumanHelpVideo(event, request, {
    data: video.data,
    mimeType: video.type,
  });

  const guide = await saveGuide(event, request, input.helperName, processedGuide);

  setResponseStatus(event, 201);

  return guide;
});
