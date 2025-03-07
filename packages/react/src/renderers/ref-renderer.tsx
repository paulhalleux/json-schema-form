import type { BaseRendererProps, SchemaRenderer } from "@phalleux/jsf-core";
import { Tester } from "@phalleux/jsf-schema-utils";

import { RenderSchema } from "../adapter";

const refTester = Tester((builder) => {
  builder.add((schema) => schema.$ref !== undefined);
});

export const refRenderer: SchemaRenderer = {
  id: "react.builtin.ref",
  tester: refTester,
  priority: 10,
  renderer: function RedRenderer({ schema, ...props }: BaseRendererProps) {
    const dereferenced = schema.toDereferenced();
    if (dereferenced.isBooleanSchema()) return null;
    return <RenderSchema schema={dereferenced.asObjectSchema()} {...props} />;
  },
};
