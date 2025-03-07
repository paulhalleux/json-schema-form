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
      return form.getFieldValue(path);
    });

    const conditioned = schema.applyConditionFor(value);
    if (!conditioned || conditioned.isBooleanSchema()) return null;

    return (
      <RenderSchema
        schema={conditioned.asObjectSchema()}
        path={path}
        {...props}
      />
    );
  },
};
