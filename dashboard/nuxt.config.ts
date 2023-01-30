export default defineNuxtConfig({
  // auth: { origin: 'https://your-cool-origin.com' }, // Uncomment for production
  runtimeConfig: {
    JWT: process.env.NUXT_SECRET,
    secrets: {
      github: {
        clientId: process.env.NUXT_GITHUB_CLIENT_ID || "",
        clientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET || "",
      },
    },
    public: {
      apiBase: "/api",
    },
  },
  modules: [
    "@sidebase/nuxt-auth",
    "@nuxtjs/tailwindcss",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", ["defineStore", "definePiniaStore"]],
      },
    ],
  ],
  css: ["@/assets/css/main.css"],
});
