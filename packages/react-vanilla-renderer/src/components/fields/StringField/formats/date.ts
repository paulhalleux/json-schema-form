import { BaseStringField } from "../BaseStringField.tsx";

import { createFormat } from "./helpers.ts";

export const DateStringFormat = createFormat({
  match: (schema) => schema.format === "date",
  component: BaseStringField,
  props: {
    type: "date",
  },
});
