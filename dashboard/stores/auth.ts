export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    async login() {
      throw new Error("Not implemented");
    },
    async logout() {
      throw new Error("Not implemented");
    },
  },
});
