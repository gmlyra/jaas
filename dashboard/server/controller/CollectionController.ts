import { Field } from "../interface/types";

const CollectionController = {
  fieldToSql: (
    field: Field,
    lastItem: boolean,
    separatorChar: string = ",",
    operation: string = "add"
  ) => {
    return `${field.name} ${operation == "alter" ? "type" : ""} ${field.type}${
      field.options?.array ? "[]" : ""
    }${field.options?.maxLength ? `(${field.options?.maxLength})` : ""} ${
      field.options?.unique ? "unique" : ""
    } ${field.options?.default ? `default ${field.options?.default}` : ""}${
      lastItem ? "" : separatorChar
    }`;
  },
  collectionToSql: (collectionName: string, fields: Field[]) => {
    let creationQuery = "";
    if (fields && fields.length > 0) {
      creationQuery = `create table api.${collectionName} (id serial primary key,`;
      fields.forEach((field, index) => {
        creationQuery += CollectionController.fieldToSql(
          field,
          index === fields.length - 1
        );
      });
      creationQuery += `);`;
    }
    return creationQuery;
  },
  alterFieldsAddToSql: (fields: Field[], collectionName: string) => {
    let alterQuery = "";
    fields.forEach((field, index) => {
      alterQuery += `alter table api.${collectionName} add column ${CollectionController.fieldToSql(
        field,
        index === fields.length - 1,
        ""
      )};`;
    });
    return alterQuery;
  },
  alterFieldsAlterToSql: (fields: Field[], collectionName: string) => {
    let alterQuery = "";
    fields.forEach((field) => {
      alterQuery += `alter table api.${collectionName} alter column ${CollectionController.fieldToSql(
        field,
        true,
        "",
        "alter"
      )};`;
    });
    return alterQuery;
  },
  alterFieldsDropToSql: (fields: Field[], collectionName: string) => {
    let alterQuery = "";
    fields.forEach((field) => {
      alterQuery += `alter table api.${collectionName} drop column ${field.name};`;
    });
    return alterQuery;
  },
  schemaToFields: (rows: any[]) => {
    const fields: Field[] = [];
    rows.forEach((row) => {
      if (row.column_name !== "id")
        fields.push({
          name: row.column_name,
          type: row.data_type,
          options: {
            unique: row.is_unique,
            maxLength: row.character_maximum_length,
            nullable: row.is_nullable,
            default: row.column_default,
            array: row.udt_name === "_int4",
          },
        });
    });
    return fields;
  },
  compareFields: (schemaFields: Field[], fields: Field[]) => {
    const fieldsToAdd: Field[] = [];
    const fieldsToUpdate: Field[] = [];
    const fieldsToRemove = schemaFields.filter((field) => {
      return !fields.map((field) => field.name).includes(field.name);
    });
    fields.forEach((field) => {
      if (!schemaFields.map((field) => field.name).includes(field.name)) {
        fieldsToAdd.push(field);
      } else if (
        !schemaFields
          .find((f) => f.name === field.name)
          ?.type.toLocaleLowerCase()
          .includes(field.type.toLocaleLowerCase())
      ) {
        fieldsToUpdate.push(field);
      }
    });
    return { fieldsToAdd, fieldsToUpdate, fieldsToRemove };
  },
};

export default CollectionController;
