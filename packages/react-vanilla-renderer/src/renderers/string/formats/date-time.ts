import { test } from "@phalleux/jsf-schema-utils";

import { createFormatRenderer } from "../format-helpers.tsx";

export const dateTimeFormatRenderer = createFormatRenderer({
  id: "date-time",
  tester: test.withStringFormat("date-time"),
  getProps: (schema) => ({
    type: "datetime-local",
    min: schema.formatMinimum ?? schema.formatExclusiveMinimum,
    max: schema.formatMaximum ?? schema.formatExclusiveMaximum,
    step: schema.formatStep ?? "1",
  }),
});
