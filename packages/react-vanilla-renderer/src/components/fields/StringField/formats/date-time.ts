import { BaseStringField } from "../BaseStringField.tsx";

import { createFormat } from "./helpers.ts";

export const DateTimeStringFormat = createFormat({
  match: (schema) =>
    schema.format === "date-time" || schema.format === "iso-date-time",
  component: BaseStringField,
  props: (schema) => ({
    type: "datetime-local",
    min: schema.formatMinimum ?? schema.formatExclusiveMinimum,
    max: schema.formatMaximum ?? schema.formatExclusiveMaximum,
    step: schema.formatStep,
  }),
});
