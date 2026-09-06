import { getRouterParam } from 'h3';
import { apiError, defineApiHandler } from '../../../utils/errors';
import { getHelpRequest } from '../../../utils/snowflake';
import { parseHelpId } from '../../../types/help';

export default defineApiHandler(async (event) => {
  const id = parseHelpId(getRouterParam(event, 'id'));

  if (!id) {
    throw apiError(400, 'INVALID_HELP_ID', 'Please provide a valid help request ID.');
  }

  const request = await getHelpRequest(event, id);

  if (!request) {
    throw apiError(404, 'HELP_REQUEST_NOT_FOUND', 'Help request not found.');
  }

  return request;
});
