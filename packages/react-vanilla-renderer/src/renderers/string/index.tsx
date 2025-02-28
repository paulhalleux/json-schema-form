import { SchemaRenderer } from "@phalleux/jsf-core";
import { Tester } from "@phalleux/jsf-schema-utils";

import { BaseStringRenderer } from "./BaseStringRenderer.tsx";
import { formats } from "./formats";

const defaultStringRenderer: SchemaRenderer = {
  id: "react-vanilla.string.default",
  tester: Tester((builder) => {
    builder.withType("string");
  }),
  priority: 0,
  renderer: ({ schema, ...props }) => (
    <BaseStringRenderer
      schema={schema}
      {...props}
      type="text"
      min={schema.minLength}
      max={schema.maxLength}
      regex={schema.pattern}
    />
  ),
};

export const stringRenderers = [defaultStringRenderer, ...formats];
