import { getRouterParam, setResponseStatus } from 'h3';
import { applyRateLimit, apiError, defineApiHandler, readValidatedJsonBody } from '../../../../utils/errors';
import { getGuide, recordHelped } from '../../../../utils/snowflake';
import { helpedEventSchema, parseHelpId } from '../../../../types/help';

export default defineApiHandler(async (event) => {
  applyRateLimit(event, 'help:helped', 30, 60_000);

  const id = parseHelpId(getRouterParam(event, 'id'));

  if (!id) {
    throw apiError(400, 'INVALID_HELP_ID', 'Please provide a valid guide ID.');
  }

  const body = await readValidatedJsonBody(event, helpedEventSchema);
  const guide = await getGuide(event, id);

  if (!guide) {
    throw apiError(404, 'HELP_GUIDE_NOT_FOUND', 'Guide not found.');
  }

  const result = await recordHelped(event, id, body);

  if (result.recorded) {
    setResponseStatus(event, 201);
  }

  return result;
});
