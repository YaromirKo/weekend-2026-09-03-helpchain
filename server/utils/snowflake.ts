import snowflake from 'snowflake-sdk';
import { randomUUID } from 'node:crypto';
import type { H3Event } from 'h3';
import type {
  CreateHelpRequestInput,
  GlobalHelpImpact,
  HelpGuide,
  HelpImpact,
  HelpRequest,
  HelpSearchResult,
  HelpedEventInput,
  ProcessedGuideContent,
} from '../types/help';
import { DEFAULT_SEARCH_THRESHOLD, HELPED_EVENT_TYPE, processedGuideSchema } from '../types/help';
import { apiError, withTimeout } from './errors';

let connectionPromise: Promise<snowflake.Connection> | undefined;

(snowflake as unknown as { configure?: (options: { logLevel: 'ERROR' }) => void })
  .configure?.({ logLevel: 'ERROR' });

type SnowflakeRow = Record<string, unknown>;

export async function executeSnowflake<T extends SnowflakeRow = SnowflakeRow>(
  event: H3Event,
  sqlText: string,
  binds: snowflake.Binds = [],
  timeoutMs = 10_000,
) {
  try {
    return await withTimeout(
      new Promise<T[]>(async (resolve, reject) => {
        try {
          const connection = await getSnowflakeConnection(event);

          connection.execute({
            sqlText,
            binds,
            complete(error, _statement, rows) {
              if (error) {
                reject(error);
                return;
              }

              resolve((rows || []) as T[]);
            },
          });
        } catch (error) {
          reject(error);
        }
      }),
      timeoutMs,
      'SNOWFLAKE_TIMEOUT',
      'The reusable help library did not respond in time.',
    );
  } catch (error) {
    if (error instanceof Error && error.name === 'ApiRouteError') {
      throw error;
    }

    if (shouldResetSnowflakeConnection(error)) {
      connectionPromise = undefined;
    }

    console.error('Snowflake query failed', sanitizeSnowflakeError(error));
    throw apiError(502, 'SNOWFLAKE_QUERY_FAILED', 'The reusable help library is unavailable.');
  }
}

export async function createHelpRequest(
  event: H3Event,
  input: CreateHelpRequestInput,
): Promise<HelpRequest> {
  const request: HelpRequest = {
    id: randomUUID(),
    title: input.title,
    description: input.description,
    category: input.category,
    askedBy: input.askedBy,
    status: 'open',
    createdAt: new Date().toISOString(),
  };

  await executeSnowflake(event, `
    INSERT INTO HELP_REQUESTS (ID, TITLE, DESCRIPTION, CATEGORY, ASKED_BY, STATUS, CREATED_AT)
    SELECT ?, ?, ?, ?, ?, ?, TO_TIMESTAMP_NTZ(?)
  `, [
    request.id,
    request.title,
    request.description,
    request.category,
    request.askedBy || null,
    request.status,
    request.createdAt,
  ]);

  return request;
}

export async function getOpenHelpRequests(event: H3Event) {
  const rows = await executeSnowflake(event, `
    SELECT ID, TITLE, DESCRIPTION, CATEGORY, ASKED_BY, STATUS, CREATED_AT
    FROM HELP_REQUESTS
    WHERE STATUS = 'open'
    ORDER BY CREATED_AT DESC
    LIMIT 20
  `);

  return rows.map(mapHelpRequestRow);
}

export async function getHelpRequest(event: H3Event, id: string) {
  const rows = await executeSnowflake(event, `
    SELECT ID, TITLE, DESCRIPTION, CATEGORY, ASKED_BY, STATUS, CREATED_AT
    FROM HELP_REQUESTS
    WHERE ID = ?
    LIMIT 1
  `, [id]);

  return rows[0] ? mapHelpRequestRow(rows[0]) : null;
}

export async function saveGuide(
  event: H3Event,
  request: HelpRequest,
  helperName: string,
  content: ProcessedGuideContent,
) {
  const guide: HelpGuide = {
    id: randomUUID(),
    requestId: request.id,
    title: content.title,
    summary: content.summary,
    helperName,
    originalRecipient: request.askedBy,
    materials: content.materials,
    steps: content.steps,
    searchableText: buildSearchableText(request, content),
    createdAt: new Date().toISOString(),
  };

  await executeSnowflake(event, `
    INSERT INTO HELP_GUIDES (
      ID,
      REQUEST_ID,
      TITLE,
      SUMMARY,
      HELPER_NAME,
      ORIGINAL_RECIPIENT,
      GUIDE_JSON,
      SEARCHABLE_TEXT,
      CREATED_AT
    )
    SELECT ?, ?, ?, ?, ?, ?, PARSE_JSON(?), ?, TO_TIMESTAMP_NTZ(?)
  `, [
    guide.id,
    guide.requestId,
    guide.title,
    guide.summary,
    guide.helperName,
    guide.originalRecipient || null,
    JSON.stringify({
      materials: guide.materials,
      steps: guide.steps,
    }),
    guide.searchableText,
    guide.createdAt,
  ]);

  await executeSnowflake(event, `
    UPDATE HELP_REQUESTS
    SET STATUS = 'processed'
    WHERE ID = ?
  `, [request.id]);

  return guide;
}

export async function getGuide(event: H3Event, id: string) {
  const rows = await executeSnowflake(event, `
    SELECT
      ID,
      REQUEST_ID,
      TITLE,
      SUMMARY,
      HELPER_NAME,
      ORIGINAL_RECIPIENT,
      GUIDE_JSON,
      SEARCHABLE_TEXT,
      CREATED_AT
    FROM HELP_GUIDES
    WHERE ID = ?
    LIMIT 1
  `, [id]);

  return rows[0] ? mapGuideRow(rows[0]) : null;
}

export async function searchGuides(
  event: H3Event,
  query: string,
): Promise<HelpSearchResult[]> {
  const config = useRuntimeConfig(event);
  const threshold = Number(config.help?.searchThreshold || DEFAULT_SEARCH_THRESHOLD);
  const rows = await executeSnowflake(event, `
    WITH IMPACT AS (
      SELECT
        HELP_ID,
        COUNT(DISTINCT ANONYMOUS_ID) AS PEOPLE_HELPED,
        COUNT(DISTINCT LANGUAGE_CODE) AS LANGUAGES_REACHED
      FROM HELP_EVENTS
      WHERE EVENT_TYPE = 'HELPED'
      GROUP BY HELP_ID
    ),
    MATCHED AS (
      SELECT
        G.ID,
        G.TITLE,
        G.SUMMARY,
        G.HELPER_NAME,
        AI_SIMILARITY(G.SEARCHABLE_TEXT, ?) AS RELEVANCE,
        COALESCE(I.PEOPLE_HELPED, 0) AS PEOPLE_HELPED,
        COALESCE(I.LANGUAGES_REACHED, 0) AS LANGUAGES_REACHED
      FROM HELP_GUIDES G
      LEFT JOIN IMPACT I ON I.HELP_ID = G.ID
    )
    SELECT
      ID,
      TITLE,
      SUMMARY,
      HELPER_NAME,
      RELEVANCE,
      PEOPLE_HELPED,
      LANGUAGES_REACHED
    FROM MATCHED
    WHERE RELEVANCE >= ?
    ORDER BY RELEVANCE DESC
    LIMIT 5
  `, [query, Number.isFinite(threshold) ? threshold : DEFAULT_SEARCH_THRESHOLD], 15_000);

  return rows.map((row) => ({
    guideId: stringValue(row.ID),
    title: stringValue(row.TITLE),
    summary: stringValue(row.SUMMARY),
    helperName: stringValue(row.HELPER_NAME),
    relevance: numberValue(row.RELEVANCE),
    peopleHelped: integerValue(row.PEOPLE_HELPED),
    languagesReached: integerValue(row.LANGUAGES_REACHED),
  }));
}

export async function recordHelped(
  event: H3Event,
  guideId: string,
  input: HelpedEventInput,
) {
  const existing = await executeSnowflake(event, `
    SELECT COUNT(*) AS TOTAL
    FROM HELP_EVENTS
    WHERE HELP_ID = ?
      AND ANONYMOUS_ID = ?
      AND EVENT_TYPE = 'HELPED'
  `, [guideId, input.anonymousId]);

  if (integerValue(existing[0]?.TOTAL) > 0) {
    return {
      recorded: false,
      reason: 'already_recorded',
    };
  }

  await executeSnowflake(event, `
    INSERT INTO HELP_EVENTS (
      ID,
      HELP_ID,
      EVENT_TYPE,
      ANONYMOUS_ID,
      DISPLAY_NAME,
      LANGUAGE_CODE,
      CREATED_AT
    )
    SELECT ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP()
  `, [
    randomUUID(),
    guideId,
    HELPED_EVENT_TYPE,
    input.anonymousId,
    input.displayName || null,
    input.language,
  ]);

  return {
    recorded: true,
  };
}

export async function getGuideImpact(
  event: H3Event,
  guideId: string,
): Promise<HelpImpact> {
  const impactRows = await executeSnowflake(event, `
      SELECT
        COUNT(DISTINCT ANONYMOUS_ID) AS PEOPLE_HELPED,
        COUNT(DISTINCT LANGUAGE_CODE) AS LANGUAGES_REACHED
      FROM HELP_EVENTS
      WHERE HELP_ID = ?
        AND EVENT_TYPE = 'HELPED'
    `, [guideId]);
  const recipientRows = await executeSnowflake(event, `
      SELECT ANONYMOUS_ID, DISPLAY_NAME
      FROM HELP_EVENTS
      WHERE HELP_ID = ?
        AND EVENT_TYPE = 'HELPED'
      QUALIFY ROW_NUMBER() OVER (
        PARTITION BY ANONYMOUS_ID
        ORDER BY CREATED_AT DESC
      ) = 1
      ORDER BY DISPLAY_NAME IS NULL, CREATED_AT DESC
      LIMIT 8
    `, [guideId]);

  const impact = impactRows[0] || {};

  return {
    peopleHelped: integerValue(impact.PEOPLE_HELPED),
    languagesReached: integerValue(impact.LANGUAGES_REACHED),
    recipients: recipientRows.map((row) => ({
      anonymousId: stringValue(row.ANONYMOUS_ID),
      displayName: optionalStringValue(row.DISPLAY_NAME),
    })),
  };
}

export async function getGlobalImpact(event: H3Event): Promise<GlobalHelpImpact> {
  const rows = await executeSnowflake(event, `
    SELECT
      (SELECT COUNT(DISTINCT HELP_ID || ':' || ANONYMOUS_ID)
       FROM HELP_EVENTS
       WHERE EVENT_TYPE = 'HELPED') AS PEOPLE_HELPED,
      (SELECT COUNT(*)
       FROM HELP_GUIDES) AS HUMAN_SOLUTIONS,
      (SELECT COUNT(DISTINCT LANGUAGE_CODE)
       FROM HELP_EVENTS
       WHERE EVENT_TYPE = 'HELPED') AS LANGUAGES_REACHED
  `);

  const row = rows[0] || {};

  return {
    peopleHelped: integerValue(row.PEOPLE_HELPED),
    humanSolutions: integerValue(row.HUMAN_SOLUTIONS),
    languagesReached: integerValue(row.LANGUAGES_REACHED),
  };
}

function getSnowflakeConnection(event: H3Event) {
  if (connectionPromise) {
    return connectionPromise;
  }

  const config = useRuntimeConfig(event);
  const snowflakeConfig = {
    account: String(config.snowflake?.account || ''),
    username: String(config.snowflake?.username || ''),
    password: String(config.snowflake?.password || ''),
    token: String(config.snowflake?.token || ''),
    warehouse: String(config.snowflake?.warehouse || 'HELPCHAIN_WH'),
    database: String(config.snowflake?.database || 'HELPCHAIN'),
    schema: String(config.snowflake?.schema || 'PUBLIC'),
    role: String(config.snowflake?.role || ''),
  };

  if (!snowflakeConfig.account || !snowflakeConfig.username || (!snowflakeConfig.password && !snowflakeConfig.token)) {
    throw apiError(503, 'SNOWFLAKE_NOT_CONFIGURED', 'Snowflake is not configured.');
  }

  connectionPromise = snowflake
    .createConnection({
      account: snowflakeConfig.account,
      username: snowflakeConfig.username,
      ...(snowflakeConfig.token
        ? {
            authenticator: 'PROGRAMMATIC_ACCESS_TOKEN',
            token: snowflakeConfig.token,
          }
        : {
            password: snowflakeConfig.password,
          }),
      warehouse: snowflakeConfig.warehouse,
      database: snowflakeConfig.database,
      schema: snowflakeConfig.schema,
      ...(snowflakeConfig.role ? { role: snowflakeConfig.role } : {}),
      timeout: 15_000,
    })
    .connectAsync()
    .catch((error) => {
      connectionPromise = undefined;
      throw error;
    });

  return connectionPromise;
}

function shouldResetSnowflakeConnection(error: unknown) {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const snowflakeError = error as { code?: unknown; sqlState?: unknown; message?: unknown };
  const message = stringValue(snowflakeError.message).toLowerCase();

  return (
    snowflakeError.code === 407002 ||
    snowflakeError.sqlState === '08003' ||
    message.includes('terminated connection') ||
    message.includes('connection failed')
  );
}

function buildSearchableText(request: HelpRequest, guide: ProcessedGuideContent) {
  return [
    request.title,
    request.description,
    guide.title,
    guide.summary,
    ...guide.materials,
    ...guide.steps.flatMap((step) => [
      step.title,
      step.action,
    ]),
  ]
    .filter(Boolean)
    .join('\n');
}

function mapHelpRequestRow(row: SnowflakeRow): HelpRequest {
  return {
    id: stringValue(row.ID),
    title: stringValue(row.TITLE),
    description: stringValue(row.DESCRIPTION),
    category: stringValue(row.CATEGORY),
    askedBy: optionalStringValue(row.ASKED_BY),
    status: stringValue(row.STATUS) === 'processed' ? 'processed' : 'open',
    createdAt: dateValue(row.CREATED_AT),
  };
}

function mapGuideRow(row: SnowflakeRow): HelpGuide {
  const guideJson = parseGuideJson(row.GUIDE_JSON);

  return {
    id: stringValue(row.ID),
    requestId: stringValue(row.REQUEST_ID),
    title: stringValue(row.TITLE),
    summary: stringValue(row.SUMMARY),
    helperName: stringValue(row.HELPER_NAME),
    originalRecipient: optionalStringValue(row.ORIGINAL_RECIPIENT),
    materials: guideJson.materials,
    steps: guideJson.steps,
    searchableText: stringValue(row.SEARCHABLE_TEXT),
    createdAt: dateValue(row.CREATED_AT),
  };
}

function parseGuideJson(value: unknown): ProcessedGuideContent {
  const parsed = typeof value === 'string' ? JSON.parse(value) : value;
  return processedGuideSchema.parse(parsed);
}

function stringValue(value: unknown) {
  return value == null ? '' : String(value);
}

function optionalStringValue(value: unknown) {
  const text = stringValue(value).trim();
  return text || undefined;
}

function numberValue(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function integerValue(value: unknown) {
  return Math.max(0, Math.trunc(numberValue(value)));
}

function dateValue(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  const text = stringValue(value);
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function sanitizeSnowflakeError(error: unknown) {
  if (!error || typeof error !== 'object') {
    return { message: String(error) };
  }

  const snowflakeError = error as { code?: unknown; sqlState?: unknown; message?: unknown };

  return {
    code: snowflakeError.code,
    sqlState: snowflakeError.sqlState,
    message: snowflakeError.message,
  };
}
