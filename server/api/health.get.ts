export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const snowflake = config.snowflake as unknown as {
    account?: string;
    username?: string;
    password?: string;
  };

  return {
    status: "ok",
    application: "HelpChain",
    providers: {
      gemini: Boolean(config.gemini?.apiKey),
      elevenLabs: Boolean(config.elevenlabs?.apiKey && config.elevenlabs?.voiceId),
      snowflake: Boolean(
        snowflake.account &&
        snowflake.username &&
        snowflake.password
      ),
    },
  }
});
