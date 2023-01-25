import { createRouter, defineEventHandler, useBase } from "h3";

import pg from "pg";

const router = createRouter();
router.get(
  "/test",
  defineEventHandler(() => {
    const Client = new pg.Client({
      host: "localhost",
      database: "jaasdb",
      port: 5432,
      user: "jaasuser",
      password: "jaasdefaultpass",
    });
    Client.connect();
    Client.query("SELECT NOW()", (err: any, res: any) => {
      if (err) {
        Client.end();
        throw err;
      }
      console.log(res);
      Client.end();
    });
    return { hello: "world" };
  })
);
export default useBase("/api/collection", router.handler);
