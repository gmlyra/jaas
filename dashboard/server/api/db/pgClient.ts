import pg from "pg";

export const pgClient = new pg.Client({
  host: "localhost",
  database: "jaasdb",
  port: 5432,
  user: "jaasuser",
  password: "jaasdefaultpass",
});
