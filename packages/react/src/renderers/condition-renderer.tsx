import type { BaseRendererProps, SchemaRenderer } from "@phalleux/jsf-core";
import { Tester } from "@phalleux/jsf-schema-utils";

import { RenderSchema, useStore } from "../adapter";

const conditionTester = Tester((builder) => {
  builder.add((schema) => schema.if !== undefined);
});

export const conditionRenderer: SchemaRenderer = {
  id: "react.builtin.condition",
  tester: conditionTester,
  priority: 50,
  renderer: function ConditionRenderer({
    schema,
    path,
    ...props
  }: BaseRendererProps) {
    const value = useStore((_, form) => {
      const parentPath = path.endsWith("]")
        ? path.slice(0, path.lastIndexOf("["))
        : path.split(".").slice(0, -1).join(".");
      return form.getFieldValue(parentPath);
    });

    return (
      <RenderSchema
        schema={schema.withAppliedCondition(value)}
        path={path}
        {...props}
      />
    );
  },
};
