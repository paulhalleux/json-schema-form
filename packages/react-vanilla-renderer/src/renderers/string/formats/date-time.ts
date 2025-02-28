import { createFormatRenderer } from "../format-helpers.tsx";

export const dateTimeFormatRenderer = createFormatRenderer({
  format: ["date-time", "iso-date-time"],
  getProps: (schema) => ({
    type: "datetime-local",
    min: schema.formatMinimum ?? schema.formatExclusiveMinimum,
    max: schema.formatMaximum ?? schema.formatExclusiveMaximum,
    step: schema.formatStep,
  }),
});
