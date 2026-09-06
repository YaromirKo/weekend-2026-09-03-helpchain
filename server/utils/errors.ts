import {
  defineEventHandler,
  getRequestHeader,
  getRequestIP,
  readBody,
  setResponseStatus,
  type EventHandlerRequest,
  type H3Event,
} from 'h3';
import { ZodError } from 'zod';

export interface ApiError {
  statusCode: number;
  code: string;
  message: string;
}

export class ApiRouteError extends Error implements ApiError {
  statusCode: number;
  code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.name = 'ApiRouteError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

type ApiHandler<T> = (event: H3Event<EventHandlerRequest>) => Promise<T> | T;

export function apiError(statusCode: number, code: string, message: string) {
  return new ApiRouteError(statusCode, code, message);
}

export function defineApiHandler<T>(handler: ApiHandler<T>) {
  return defineEventHandler(async (event) => {
    try {
      return await handler(event);
    } catch (error) {
      const response = normalizeApiError(error);

      if (!(error instanceof ApiRouteError) && !(error instanceof ZodError)) {
        console.error('Unhandled API error', error);
      }

      setResponseStatus(event, response.statusCode);
      return response;
    }
  });
}

export function requireJsonContentType(event: H3Event) {
  const contentType = getRequestHeader(event, 'content-type') || '';

  if (!contentType.toLowerCase().startsWith('application/json')) {
    throw apiError(415, 'UNSUPPORTED_CONTENT_TYPE', 'Please send a JSON request body.');
  }
}

export function requireMultipartContentType(event: H3Event) {
  const contentType = getRequestHeader(event, 'content-type') || '';

  if (!contentType.toLowerCase().startsWith('multipart/form-data')) {
    throw apiError(415, 'UNSUPPORTED_CONTENT_TYPE', 'Please upload the demonstration as multipart form data.');
  }
}

export async function readValidatedJsonBody<T>(
  event: H3Event,
  schema: { parse: (value: unknown) => T },
  maxBytes = 10_000,
) {
  requireJsonContentType(event);
  const contentLength = Number(getRequestHeader(event, 'content-length') || 0);

  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw apiError(413, 'JSON_BODY_TOO_LARGE', 'Please send a smaller request body.');
  }

  const body = await readBody(event);
  return schema.parse(body);
}

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  code: string,
  message: string,
) {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeout = setTimeout(() => reject(apiError(504, code, message)), timeoutMs);
      }),
    ]);
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}

type RateLimitWindow = {
  count: number;
  resetAt: number;
};

const rateLimitWindows = new Map<string, RateLimitWindow>();

export function applyRateLimit(
  event: H3Event,
  name: string,
  limit: number,
  windowMs: number,
) {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown';
  const key = `${name}:${ip}`;
  const now = Date.now();
  const current = rateLimitWindows.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitWindows.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (current.count >= limit) {
    throw apiError(429, 'RATE_LIMITED', 'Please wait a moment before trying again.');
  }

  current.count += 1;
}

function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiRouteError) {
    return {
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
    };
  }

  if (error instanceof ZodError) {
    return {
      statusCode: 400,
      code: 'VALIDATION_FAILED',
      message: 'Please check the request and try again.',
    };
  }

  return {
    statusCode: 500,
    code: 'INTERNAL_ERROR',
    message: 'Something went wrong.',
  };
}
