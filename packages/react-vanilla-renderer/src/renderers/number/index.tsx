import { SchemaRenderer } from "@phalleux/jsf-core";
import { Tester } from "@phalleux/jsf-schema-utils";

import { BaseNumberRenderer } from "./BaseNumberRenderer.tsx";

const defaultNumberRenderer: SchemaRenderer = {
  id: "react-vanilla.number.default",
  tester: Tester((builder) => {
    builder.withType("number");
  }),
  priority: 0,
  renderer: ({ schema, ...props }) => (
    <BaseNumberRenderer
      schema={schema}
      {...props}
      min={
        schema.minimum === undefined && schema.exclusiveMinimum !== undefined
          ? schema.exclusiveMinimum + 1
          : schema.minimum
      }
      max={
        schema.maximum === undefined && schema.exclusiveMaximum !== undefined
          ? schema.exclusiveMaximum - 1
          : schema.maximum
      }
      step={schema.multipleOf}
    />
  ),
};

export const numberRenderers = [defaultNumberRenderer];
