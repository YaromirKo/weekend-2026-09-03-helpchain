export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);

  return {
    status: "ok",
    application: "HelpChain",
    providers: {
      gemini: Boolean(config.gemini?.apiKey),
      elevenLabs: Boolean(config.elevenlabs?.apiKey && config.elevenlabs?.voiceId),
      snowflake: Boolean(
        config.snowflake?.account &&
        config.snowflake?.username &&
        (config.snowflake?.password || config.snowflake?.token)
      ),
    },
  }
});
