import type { BaseRendererProps, SchemaRenderer } from "@phalleux/jsf-core";
import { Tester } from "@phalleux/jsf-schema-utils";

import { RenderSchema, useStore } from "../adapter";

const allOfTester = Tester((builder) => {
  builder.add((schema) => schema.allOf !== undefined);
});

export const allOfRenderer: SchemaRenderer = {
  id: "react.builtin.allOf",
  tester: allOfTester,
  priority: 10,
  renderer: function AllOfRenderer({
    schema,
    path,
    ...props
  }: BaseRendererProps) {
    const value = useStore((_, form) => {
      return form.getFieldValue(path);
    });

    const resolved = schema.toResolved(value);
    if (resolved.isBooleanSchema()) return null;

    return (
      <RenderSchema schema={resolved.asObjectSchema()} path={path} {...props} />
    );
  },
};
