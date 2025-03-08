import type { BaseRendererProps, SchemaRenderer } from "@phalleux/jsf-core";
import { createTester, test } from "@phalleux/jsf-schema-utils";

import { RenderSchema, useStore } from "../adapter";
import { Priorities } from "../constants/priorities.ts";

const conditionTester = createTester(Priorities.CONDITION, test.keyword("if"));

export const conditionRenderer: SchemaRenderer = {
  id: "react.builtin.condition",
  tester: conditionTester,
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
