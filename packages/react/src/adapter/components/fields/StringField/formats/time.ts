import { BaseStringField } from "../BaseStringField.tsx";

import { createFormat } from "./helpers.ts";

export const TimeStringFormat = createFormat({
  match: (schema) => schema.format === "time" || schema.format === "iso-time",
  component: BaseStringField,
  props: (schema) => ({
    type: "time",
    min: schema.formatMinimum ?? schema.formatExclusiveMinimum,
    max: schema.formatMaximum ?? schema.formatExclusiveMaximum,
    step: schema.formatStep,
  }),
});
