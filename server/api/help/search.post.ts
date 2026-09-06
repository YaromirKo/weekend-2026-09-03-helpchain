import { applyRateLimit, defineApiHandler, readValidatedJsonBody } from '../../utils/errors';
import { searchGuides } from '../../utils/snowflake';
import { searchHelpSchema } from '../../types/help';

export default defineApiHandler(async (event) => {
  applyRateLimit(event, 'help:search', 30, 60_000);

  const body = await readValidatedJsonBody(event, searchHelpSchema);

  return searchGuides(event, body.query);
});
