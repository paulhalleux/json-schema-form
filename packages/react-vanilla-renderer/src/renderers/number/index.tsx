import type { SchemaRenderer } from "@phalleux/jsf-core";
import { Tester } from "@phalleux/jsf-schema-utils";

import { BaseNumberRenderer } from "./BaseNumberRenderer.tsx";

const defaultNumberRenderer: SchemaRenderer = {
  id: "react-vanilla.number.default",
  tester: Tester((builder) => {
    builder.withType("number");
  }),
  priority: 0,
  renderer: ({ schema, ...props }) => {
    const jsonSchema = schema.toJSON();
    return (
      <BaseNumberRenderer
        schema={schema}
        {...props}
        min={
          jsonSchema.minimum === undefined &&
          jsonSchema.exclusiveMinimum !== undefined
            ? jsonSchema.exclusiveMinimum + 1
            : jsonSchema.minimum
        }
        max={
          jsonSchema.maximum === undefined &&
          jsonSchema.exclusiveMaximum !== undefined
            ? jsonSchema.exclusiveMaximum - 1
            : jsonSchema.maximum
        }
        step={jsonSchema.multipleOf}
      />
    );
  },
};

export const numberRenderers = [defaultNumberRenderer];
