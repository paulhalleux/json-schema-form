import type { BaseRendererProps, SchemaRenderer } from "@phalleux/jsf-core";
import { createTester, test } from "@phalleux/jsf-schema-utils";

import { RenderSchema } from "../adapter";
import { Priorities } from "../constants/priorities.ts";

const refTester = createTester(Priorities.REF, test.keyword("$ref"));

export const refRenderer: SchemaRenderer = {
  id: "react.builtin.ref",
  tester: refTester,
  renderer: function RedRenderer({ schema, ...props }: BaseRendererProps) {
    const dereferenced = schema.toDereferenced();
    if (dereferenced.isBooleanSchema()) return null;
    return <RenderSchema schema={dereferenced.asObjectSchema()} {...props} />;
  },
};
