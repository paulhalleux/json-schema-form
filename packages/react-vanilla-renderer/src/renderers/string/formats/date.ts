import { test } from "@phalleux/jsf-schema-utils";

import { createFormatRenderer } from "../format-helpers.tsx";

export const dateFormatRenderer = createFormatRenderer({
  id: "date",
  tester: test.withStringFormat("date"),
  getProps: (schema) => ({
    type: "date",
    min: schema.formatMinimum ?? schema.formatExclusiveMinimum,
    max: schema.formatMaximum ?? schema.formatExclusiveMaximum,
    step: schema.formatStep,
  }),
});
