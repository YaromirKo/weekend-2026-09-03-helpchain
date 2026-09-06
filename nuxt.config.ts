import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: false,

  nitro: {
    preset: "node-server",
  },
  runtimeConfig: {
    help: {
      searchThreshold: 0.55,
      maxVideoBytes: 20 * 1024 * 1024,
    },

    gemini: {
      apiKey: "",
      model: "gemini-3.8-flash",
    },

    elevenlabs: {
      apiKey: "",
      voiceId: "",
    },

    snowflake: {
      account: "",
      username: "",
      password: "",
      token: "",
      warehouse: "HELPCHAIN_WH",
      database: "HELPCHAIN",
      schema: "PUBLIC",
      role: "",
    },
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
