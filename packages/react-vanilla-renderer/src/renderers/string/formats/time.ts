import { createFormatRenderer } from "../format-helpers.tsx";

export const timeFormatRenderer = createFormatRenderer({
  format: ["time", "iso-time"],
  getProps: (schema) => ({
    type: "time",
    min: schema.formatMinimum ?? schema.formatExclusiveMinimum,
    max: schema.formatMaximum ?? schema.formatExclusiveMaximum,
    step: schema.formatStep,
  }),
});
