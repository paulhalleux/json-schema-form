import { test } from "@phalleux/jsf-schema-utils";

import { createFormatRenderer } from "../format-helpers.tsx";

export const timeFormatRenderer = createFormatRenderer({
  id: "time",
  tester: test.withStringFormat("time"),
  getProps: (schema) => ({
    type: "time",
    min: schema.formatMinimum ?? schema.formatExclusiveMinimum,
    max: schema.formatMaximum ?? schema.formatExclusiveMaximum,
    step: schema.formatStep ?? "1",
  }),
});
