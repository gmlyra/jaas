import { describe, test, expect } from "vitest";
import { setup, $fetch } from "@nuxt/test-utils";
describe("Example front-end test", async () => {
  await setup({});
  test("Test if app dashboard is being rendered", async () => {
    const html = await $fetch("/");
    expect(html).toContain("Dashboard");
  });
});
