import { getRouterParam } from 'h3';
import { apiError, defineApiHandler } from '../../../../utils/errors';
import { getGuide } from '../../../../utils/snowflake';
import { parseHelpId } from '../../../../types/help';

export default defineApiHandler(async (event) => {
  const id = parseHelpId(getRouterParam(event, 'id'));

  if (!id) {
    throw apiError(400, 'INVALID_HELP_ID', 'Please provide a valid guide ID.');
  }

  const guide = await getGuide(event, id);

  if (!guide) {
    throw apiError(404, 'HELP_GUIDE_NOT_FOUND', 'Guide not found.');
  }

  return guide;
});
