import { defineApiHandler } from '../../../utils/errors';
import { getOpenHelpRequests } from '../../../utils/snowflake';

export default defineApiHandler((event) => getOpenHelpRequests(event));
