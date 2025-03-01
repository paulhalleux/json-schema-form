import type { FormJsonSchema } from "@phalleux/jsf-core";

export type SchemaExample = {
  id: string;
  title: string;
  schema: FormJsonSchema;
};

export type SchemaExampleCategory = {
  id: string;
  title: string;
  children: (SchemaExample | SchemaExampleCategory)[];
};
