export default defineNuxtConfig({
  runtimeConfig: {
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
