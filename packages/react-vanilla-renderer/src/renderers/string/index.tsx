import { SchemaRenderer } from "@phalleux/jsf-core";
import { Tester } from "@phalleux/jsf-schema-utils";

import { BaseStringRenderer } from "./BaseStringRenderer.tsx";
import { formats } from "./formats";

const defaultStringRenderer: SchemaRenderer = {
  tester: Tester.isStringSchema,
  priority: 0,
  renderer: ({ schema, path }) => (
    <BaseStringRenderer
      schema={schema}
      path={path}
      type="text"
      min={schema.minLength}
      max={schema.maxLength}
      regex={schema.pattern}
    />
  ),
};

export const stringRenderers = [defaultStringRenderer, ...formats];
