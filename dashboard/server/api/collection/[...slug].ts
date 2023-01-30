import { createRouter, defineEventHandler, useBase } from "h3";

import { Field } from "~~/server/interface/types";
import { pgClient } from "../db/pgClient";
import CollectionController from "~~/server/controller/CollectionController";

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

    const Client = pgClient();
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
        creationQuery = CollectionController.collectionToSql(name, fields);
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
    const Client = pgClient();
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

      const schemaFields = CollectionController.schemaToFields(schema.rows);

      const { fieldsToAdd, fieldsToUpdate, fieldsToRemove } =
        CollectionController.compareFields(schemaFields, fields);

      let updateQuery = "";

      // Add all fields to the query

      updateQuery += CollectionController.alterFieldsAddToSql(
        fieldsToAdd,
        collectionName
      );
      updateQuery += CollectionController.alterFieldsAlterToSql(
        fieldsToUpdate,
        collectionName
      );
      updateQuery += CollectionController.alterFieldsDropToSql(
        fieldsToRemove,
        collectionName
      );

      const execute = await Client.query(updateQuery);
      if (execute) {
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

    const Client = pgClient();
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
