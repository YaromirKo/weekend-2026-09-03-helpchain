// server/plugins/logger.ts
import { consola, LogLevels } from "consola";

export default defineNitroPlugin(() => {
  consola.options.formatOptions = { date: true };
  consola.level = LogLevels.debug;
});
