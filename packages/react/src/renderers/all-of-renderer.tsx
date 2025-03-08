import type { BaseRendererProps, SchemaRenderer } from "@phalleux/jsf-core";
import { createTester, test } from "@phalleux/jsf-schema-utils";

import { RenderSchema, useStore } from "../adapter";
import { Priorities } from "../constants/priorities.ts";

const allOfTester = createTester(Priorities.ALL_OF, test.keyword("allOf"));

export const allOfRenderer: SchemaRenderer = {
  id: "react.builtin.allOf",
  tester: allOfTester,
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
