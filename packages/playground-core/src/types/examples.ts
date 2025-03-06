import type { ObjectSchema } from "@phalleux/jsf-schema-utils";

export type SchemaExample = {
  id: string;
  title: string;
  schema: ObjectSchema;
};

export type SchemaExampleCategory = {
  id: string;
  title: string;
  children: (SchemaExample | SchemaExampleCategory)[];
};
