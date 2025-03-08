import { test } from "@phalleux/jsf-schema-utils";

import { createFormatRenderer } from "../format-helpers.tsx";

export const emailFormatRenderer = createFormatRenderer({
  id: "email",
  tester: test.or(
    test.withStringFormat("email"),
    test.withStringFormat("idn-email"),
  ),
  getProps: () => ({
    type: "email",
  }),
});
