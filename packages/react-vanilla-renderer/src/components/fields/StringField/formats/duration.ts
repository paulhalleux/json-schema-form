import format from "ajv-formats";

import { BaseStringField } from "../BaseStringField.tsx";

import { createFormat } from "./helpers.ts";

export const DurationStringFormat = createFormat({
  match: (schema) => schema.format === "duration",
  component: BaseStringField,
  props: {
    type: "string",
    regex: format.get("duration").toString(),
  },
});
