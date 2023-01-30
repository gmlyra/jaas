import { NuxtAuthHandler } from "#auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
const config = useRuntimeConfig();

export default NuxtAuthHandler({
  secret: config.JWT,
  providers: [
    // @ts-expect-error
    GithubProvider.default({
      clientId: config.secrets.github.clientId,
      clientSecret: config.secrets.github.clientSecret,
    }),
    // @ts-expect-error
    CredentialsProvider.default({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials: any) => {
        // const res = await fetch("/your/endpoint", {
        //   method: "POST",
        //   body: JSON.stringify(credentials),
        //   headers: { "Content-Type": "application/json" },
        // });
        // const user = await res.json();

        const res = {
          ok: true,
        };

        const user = {
          email: "test@email.com",
          name: "test",
          role: "admin",
        };

        if (res.ok && user) {
          return user;
        }
        return null;
      },
    }),
  ],
});
