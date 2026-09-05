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
    gemini: {
      apiKey: "",
    },

    elevenlabs: {
      apiKey: "",
    },

    snowflake: {
      account: "",
      username: "",
      password: "",
      warehouse: "",
      database: "",
      schema: "",
    },
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
