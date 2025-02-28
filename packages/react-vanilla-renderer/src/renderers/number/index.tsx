import { SchemaRenderer } from "@phalleux/jsf-core";
import { Tester } from "@phalleux/jsf-schema-utils";

import { BaseNumberRenderer } from "./BaseNumberRenderer.tsx";

const defaultNumberRenderer: SchemaRenderer = {
  tester: Tester.isNumericSchema,
  priority: 0,
  renderer: ({ schema, path }) => (
    <BaseNumberRenderer
      schema={schema}
      path={path}
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
