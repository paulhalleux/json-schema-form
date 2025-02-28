import { createFormatRenderer } from "../format-helpers.tsx";

export const dateFormatRenderer = createFormatRenderer({
  format: "date",
  getProps: (schema) => ({
    type: "date",
    min: schema.formatMinimum ?? schema.formatExclusiveMinimum,
    max: schema.formatMaximum ?? schema.formatExclusiveMaximum,
    step: schema.formatStep,
  }),
});
