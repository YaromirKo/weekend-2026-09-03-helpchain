CREATE ROLE IF NOT EXISTS HELPCHAIN_ROLE;

CREATE WAREHOUSE IF NOT EXISTS HELPCHAIN_WH
  WAREHOUSE_SIZE = 'X-SMALL'
  AUTO_SUSPEND = 60
  AUTO_RESUME = TRUE;

CREATE DATABASE IF NOT EXISTS HELPCHAIN;
CREATE SCHEMA IF NOT EXISTS HELPCHAIN.PUBLIC;

GRANT USAGE ON WAREHOUSE HELPCHAIN_WH TO ROLE HELPCHAIN_ROLE;
GRANT USAGE ON DATABASE HELPCHAIN TO ROLE HELPCHAIN_ROLE;
GRANT USAGE ON SCHEMA HELPCHAIN.PUBLIC TO ROLE HELPCHAIN_ROLE;
GRANT DATABASE ROLE SNOWFLAKE.CORTEX_USER TO ROLE HELPCHAIN_ROLE;

USE DATABASE HELPCHAIN;
USE SCHEMA PUBLIC;

CREATE TABLE IF NOT EXISTS HELP_REQUESTS (
    ID VARCHAR NOT NULL,
    TITLE VARCHAR NOT NULL,
    DESCRIPTION VARCHAR NOT NULL,
    CATEGORY VARCHAR NOT NULL,
    ASKED_BY VARCHAR,
    STATUS VARCHAR NOT NULL,
    CREATED_AT TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

CREATE TABLE IF NOT EXISTS HELP_GUIDES (
    ID VARCHAR NOT NULL,
    REQUEST_ID VARCHAR NOT NULL,
    TITLE VARCHAR NOT NULL,
    SUMMARY VARCHAR,
    HELPER_NAME VARCHAR,
    ORIGINAL_RECIPIENT VARCHAR,
    GUIDE_JSON VARIANT NOT NULL,
    SEARCHABLE_TEXT VARCHAR NOT NULL,
    CREATED_AT TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

CREATE TABLE IF NOT EXISTS HELP_EVENTS (
    ID VARCHAR NOT NULL,
    HELP_ID VARCHAR NOT NULL,
    EVENT_TYPE VARCHAR NOT NULL,
    ANONYMOUS_ID VARCHAR,
    DISPLAY_NAME VARCHAR,
    LANGUAGE_CODE VARCHAR,
    CREATED_AT TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA HELPCHAIN.PUBLIC TO ROLE HELPCHAIN_ROLE;
GRANT SELECT, INSERT, UPDATE ON FUTURE TABLES IN SCHEMA HELPCHAIN.PUBLIC TO ROLE HELPCHAIN_ROLE;

INSERT INTO HELP_REQUESTS (ID, TITLE, DESCRIPTION, CATEGORY, ASKED_BY, STATUS, CREATED_AT)
SELECT
  'request-pothos-yellow-wet-soil',
  'Why are my pothos leaves yellow when the soil is still wet?',
  'The soil stays damp for days and the leaves keep turning yellow. I need to know what to check first.',
  'Plants',
  'Anna',
  'processed',
  CURRENT_TIMESTAMP()
WHERE NOT EXISTS (
  SELECT 1 FROM HELP_REQUESTS WHERE ID = 'request-pothos-yellow-wet-soil'
);

INSERT INTO HELP_REQUESTS (ID, TITLE, DESCRIPTION, CATEGORY, ASKED_BY, STATUS, CREATED_AT)
SELECT
  'request-slip-knot',
  'How do I make a slip knot without it collapsing?',
  'The loop keeps falling apart when I tighten it before starting a scarf.',
  'Crafts',
  'Anna',
  'open',
  DATEADD(minute, 1, CURRENT_TIMESTAMP())
WHERE NOT EXISTS (
  SELECT 1 FROM HELP_REQUESTS WHERE ID = 'request-slip-knot'
);

INSERT INTO HELP_GUIDES (
  ID,
  REQUEST_ID,
  TITLE,
  SUMMARY,
  HELPER_NAME,
  ORIGINAL_RECIPIENT,
  GUIDE_JSON,
  SEARCHABLE_TEXT,
  CREATED_AT
)
SELECT
  'guide-pothos-overwatered',
  'request-pothos-yellow-wet-soil',
  'Recovering an overwatered pothos',
  'John shows how to check wet soil and roots, let the plant dry out, and reduce watering so yellow leaves do not keep spreading.',
  'John',
  'Anna',
  PARSE_JSON($$
{
  "materials": [
    "Pothos plant",
    "Paper towel",
    "Dry potting mix",
    "Pot with drainage holes"
  ],
  "steps": [
    {
      "order": 1,
      "title": "Check the soil and roots",
      "action": "Lift the plant from the pot, feel whether the soil is still wet, and look for soft dark roots that show overwatering.",
      "startTime": 2,
      "endTime": 8
    },
    {
      "order": 2,
      "title": "Let the root ball dry",
      "action": "Set the root ball on a paper towel and allow the soil to dry before putting it back into a pot.",
      "startTime": 8,
      "endTime": 16
    },
    {
      "order": 3,
      "title": "Restart with less water",
      "action": "Use a pot with drainage, replace heavy wet soil if needed, and wait until the top soil dries before watering again.",
      "startTime": 16,
      "endTime": 27
    }
  ]
}
$$),
  $$Why are my pothos leaves yellow when the soil is still wet?
The soil stays damp for days and the leaves keep turning yellow. I need to know what to check first.
Recovering an overwatered pothos
John shows how to check wet soil and roots, let the plant dry out, and reduce watering so yellow leaves do not keep spreading.
Pothos plant
Paper towel
Dry potting mix
Pot with drainage holes
yellow leaves
wet soil
overwatering
roots
allow soil to dry
reduce watering
Check the soil and roots
Lift the plant from the pot, feel whether the soil is still wet, and look for soft dark roots that show overwatering.
Let the root ball dry
Set the root ball on a paper towel and allow the soil to dry before putting it back into a pot.
Restart with less water
Use a pot with drainage, replace heavy wet soil if needed, and wait until the top soil dries before watering again.$$,
  CURRENT_TIMESTAMP()
WHERE NOT EXISTS (
  SELECT 1 FROM HELP_GUIDES WHERE ID = 'guide-pothos-overwatered'
);

INSERT INTO HELP_EVENTS (ID, HELP_ID, EVENT_TYPE, ANONYMOUS_ID, DISPLAY_NAME, LANGUAGE_CODE, CREATED_AT)
SELECT
  V.ID,
  V.HELP_ID,
  V.EVENT_TYPE,
  V.ANONYMOUS_ID,
  V.DISPLAY_NAME,
  V.LANGUAGE_CODE,
  CURRENT_TIMESTAMP()
FROM VALUES
  ('event-pothos-001', 'guide-pothos-overwatered', 'HELPED', 'seed-person-001', 'Anna', 'en'),
  ('event-pothos-002', 'guide-pothos-overwatered', 'HELPED', 'seed-person-002', 'Carlos', 'es'),
  ('event-pothos-003', 'guide-pothos-overwatered', 'HELPED', 'seed-person-003', 'Mei', 'zh'),
  ('event-pothos-004', 'guide-pothos-overwatered', 'HELPED', 'seed-person-004', 'Niko', 'en'),
  ('event-pothos-005', 'guide-pothos-overwatered', 'HELPED', 'seed-person-005', 'Sara', 'es'),
  ('event-pothos-006', 'guide-pothos-overwatered', 'HELPED', 'seed-person-006', 'Priya', 'en'),
  ('event-pothos-007', 'guide-pothos-overwatered', 'HELPED', 'seed-person-007', 'Omar', 'en'),
  ('event-pothos-008', 'guide-pothos-overwatered', 'HELPED', 'seed-person-008', 'Jules', 'zh'),
  ('event-pothos-009', 'guide-pothos-overwatered', 'HELPED', 'seed-person-009', 'Mina', 'zh'),
  ('event-pothos-010', 'guide-pothos-overwatered', 'HELPED', 'seed-person-010', 'Leo', 'en'),
  ('event-pothos-011', 'guide-pothos-overwatered', 'HELPED', 'seed-person-011', 'Ava', 'es'),
  ('event-pothos-012', 'guide-pothos-overwatered', 'HELPED', 'seed-person-012', 'Noor', 'en'),
  ('event-pothos-013', 'guide-pothos-overwatered', 'HELPED', 'seed-person-013', 'Iris', 'zh'),
  ('event-pothos-014', 'guide-pothos-overwatered', 'HELPED', 'seed-person-014', 'Ben', 'en'),
  ('event-pothos-015', 'guide-pothos-overwatered', 'HELPED', 'seed-person-015', 'Lina', 'es'),
  ('event-pothos-016', 'guide-pothos-overwatered', 'HELPED', 'seed-person-016', 'Tao', 'en'),
  ('event-pothos-017', 'guide-pothos-overwatered', 'HELPED', 'seed-person-017', 'Rae', 'zh'),
  ('event-pothos-018', 'guide-pothos-overwatered', 'HELPED', 'seed-person-018', 'Sam', 'en')
  AS V(ID, HELP_ID, EVENT_TYPE, ANONYMOUS_ID, DISPLAY_NAME, LANGUAGE_CODE)
WHERE NOT EXISTS (
  SELECT 1
  FROM HELP_EVENTS E
  WHERE E.HELP_ID = V.HELP_ID
    AND E.EVENT_TYPE = V.EVENT_TYPE
    AND E.ANONYMOUS_ID = V.ANONYMOUS_ID
);

-- Manual semantic search smoke test after setup:
-- SELECT
--   ID,
--   TITLE,
--   AI_SIMILARITY(SEARCHABLE_TEXT, 'My houseplant leaves keep turning yellow and the dirt never dries.') AS RELEVANCE
-- FROM HELP_GUIDES
-- ORDER BY RELEVANCE DESC
-- LIMIT 5;
