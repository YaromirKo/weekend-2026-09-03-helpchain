-- HelpChain Snowflake reference.
--
-- Assumes the warehouse, database, schema, tables, role, and application user
-- already exist. This file intentionally does not create infrastructure.
--
-- If the app connects with NUXT_SNOWFLAKE_ROLE=HELPCHAIN_ROLE, make sure that
-- role already exists and is granted to NUXT_SNOWFLAKE_USERNAME.
--
-- Required privileges for the application role/user:
-- - USAGE on the configured warehouse, database, and schema
-- - SELECT, INSERT, UPDATE on HELP_REQUESTS, HELP_GUIDES, HELP_EVENTS
-- - SNOWFLAKE.CORTEX_USER database role for AI_SIMILARITY

USE DATABASE HELPCHAIN;
USE SCHEMA PUBLIC;

-- Manual semantic search smoke test:
-- SELECT
--   ID,
--   TITLE,
--   AI_SIMILARITY(SEARCHABLE_TEXT, '<query text>') AS RELEVANCE
-- FROM HELP_GUIDES
-- ORDER BY RELEVANCE DESC
-- LIMIT 5;
