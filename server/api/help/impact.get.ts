import { defineApiHandler } from '../../utils/errors';
import { getGlobalImpact } from '../../utils/snowflake';

export default defineApiHandler((event) => getGlobalImpact(event));
