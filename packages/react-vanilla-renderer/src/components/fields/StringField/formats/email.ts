import { JSONSchema } from "@phalleux/jsf-core";

import { BaseStringField } from "../BaseStringField.tsx";

import { createFormat } from "./helpers.ts";

export const EmailStringFormat = createFormat({
  match: (schema) => schema.format === "email",
  component: BaseStringField,
  props: (schema: JSONSchema) => ({
    type: "email",
    regex: schema.pattern,
    maxLength: schema.maxLength,
    minLength: schema.minLength,
  }),
});
