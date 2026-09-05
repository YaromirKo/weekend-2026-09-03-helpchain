// server/api/health.get.ts

import { consola } from 'consola'

export default defineEventHandler(() => {
  return {
    status: "ok",
    application: "HelpChain",
    timestamp: new Date().toISOString(),
  }
});
