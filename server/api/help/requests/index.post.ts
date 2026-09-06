import { setResponseStatus } from 'h3';
import { defineApiHandler, readValidatedJsonBody } from '../../../utils/errors';
import { createHelpRequest } from '../../../utils/snowflake';
import { createHelpRequestSchema } from '../../../types/help';

export default defineApiHandler(async (event) => {
  const body = await readValidatedJsonBody(event, createHelpRequestSchema);
  const request = await createHelpRequest(event, body);

  setResponseStatus(event, 201);

  return request;
});
