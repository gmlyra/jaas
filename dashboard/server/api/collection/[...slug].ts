import { createRouter, defineEventHandler, useBase } from "h3";

import { Field } from "~~/server/interface/types";
import { pgClient } from "../db/pgClient";

const router = createRouter();

router.post(
  "/create",
  defineEventHandler(async (event) => {
    const {
      name,
      isPublic,
      fields,
    }: { name: string; isPublic: boolean; fields: Field[] } = await readBody(
      event
    );

    const Client = pgClient;
    Client.connect();
    try {
      const exists = await Client.query(
        `select exists(select * from information_schema.tables where table_name = '${name}');`
      );
      if (exists.rows[0].exists) {
        setResponseStatus(event, 400);
        return { msg: "Collection already exists" };
      }

      // Drop field with name id if it exists
      fields.forEach((field, index) => {
        if (field.name === "id") {
          fields.splice(index, 1);
        }
      });

      let creationQuery = "";

      // Add all fields to the query
      if (fields && fields.length > 0) {
        creationQuery = `create table api.${name} (id serial primary key,`;
        fields.forEach((field, index) => {
          creationQuery += `${field.name} ${field.type}${
            field.options?.array ? "[]" : ""
          } ${field.options?.unique ? "unique" : ""} ${
            field.options?.default ? `default ${field.options?.default}` : ""
          }${index === fields.length - 1 ? "" : ","}`;
        });
        creationQuery += `);`;
      } else {
        setResponseStatus(event, 400);
        return { msg: "No fields provided" };
      }

      if (isPublic) {
        creationQuery += `
          grant select on api.${name} to web_anon;
        `;
      }
      const response = await Client.query(creationQuery);
      if (response) {
        setResponseStatus(event, 201);
        return { msg: "Collection created" };
      }
    } catch (e) {
      console.log(e);
      throw createError({
        statusCode: 500,
        statusMessage: "Internal Server Error",
      });
    } finally {
      Client.end();
    }
  })
);

router.patch(
  "/update",
  defineEventHandler(async (event) => {
    const {
      collectionName,
      dropId,
      fields,
    }: { collectionName: string; dropId: boolean; fields: Field[] } =
      await readBody(event);
    const Client = pgClient;
    Client.connect();
    try {
      let schema = await Client.query(`
        SELECT *
          FROM INFORMATION_SCHEMA.COLUMNS
          WHERE TABLE_NAME = N'${collectionName}';
      `);
      if (dropId || dropId === undefined) {
        // Drop id from schema.rows
        schema.rows = schema.rows.filter((row) => row.column_name !== "id");
      }

      const schemaFields = schema.rows.map((row) => row.column_name);
      const fieldsToAdd: Field[] = [];
      const fieldsToUpdate: Field[] = [];
      const fieldsToRemove = schemaFields.filter((field) => {
        return !fields.map((field) => field.name).includes(field);
      });
      fields.forEach((field) => {
        if (!schemaFields.includes(field.name)) {
          fieldsToAdd.push(field);
        } else if (
          field.type.toLocaleLowerCase() !==
          schema.rows.find((row) => row.column_name === field.name).data_type
        ) {
          fieldsToUpdate.push(field);
        }
      });

      let updateQuery = "";
      if (fieldsToAdd.length > 0) {
        fieldsToAdd.forEach((field, index) => {
          updateQuery += `alter table api.${collectionName} add column ${
            field.name
          } ${field.type}${field.options?.array ? "[]" : ""} ${
            field.options?.unique ? "unique" : ""
          } ${
            field.options?.default ? `default ${field.options?.default}` : ""
          }${index === fieldsToAdd.length - 1 ? "" : ","}`;
          updateQuery += ";";
        });
      }
      if (fieldsToUpdate.length > 0) {
        fieldsToUpdate.forEach((field, index) => {
          updateQuery += `alter table api.${collectionName} alter column ${
            field.name
          } type ${field.type}${field.options?.array ? "[]" : ""} ${
            field.options?.unique ? "unique" : ""
          } ${
            field.options?.default ? `default ${field.options?.default}` : ""
          }${index === fieldsToUpdate.length - 1 ? "" : ","}`;
        });
        updateQuery += ";";
      }
      if (fieldsToRemove.length > 0) {
        fieldsToRemove.forEach((field, index) => {
          updateQuery += `alter table api.${collectionName} drop column ${field}${
            index === fieldsToRemove.length - 1 ? "" : ","
          }`;
          updateQuery += ";";
        });
      }
      const execute = await Client.query(updateQuery);
      if (execute) {
        setResponseStatus(event, 200);
        return { msg: "Collection updated" };
      } else {
        setResponseStatus(event, 400);
        return { msg: "Collection not updated" };
      }
    } catch (e) {
      console.log(e);
      throw createError({
        statusCode: 500,
        statusMessage: "Internal Server Error",
      });
    } finally {
      Client.end();
    }
  })
);

router.delete(
  "/delete",
  defineEventHandler(async (event) => {
    const { collectionName }: { collectionName: string } = await readBody(
      event
    );

    const Client = pgClient;
    Client.connect();
    try {
      const response = await Client.query(`drop table api.${collectionName};`);
      if (response) {
        return { msg: "Collection deleted" };
      } else {
        setResponseStatus(event, 400);
        return { msg: "Collection not deleted" };
      }
    } catch (e) {
      console.log(e);
      throw createError({
        statusCode: 500,
        statusMessage: "Internal Server Error",
      });
    } finally {
      Client.end();
    }
  })
);

export default useBase("/api/collection", router.handler);
