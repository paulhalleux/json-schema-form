import type { SchemaRenderer } from "@phalleux/jsf-core";
import { Tester } from "@phalleux/jsf-schema-utils";

import { BaseStringRenderer } from "./BaseStringRenderer.tsx";
import { formats } from "./formats";

const defaultStringRenderer: SchemaRenderer = {
  id: "react-vanilla.string.default",
  tester: Tester((builder) => {
    builder.withType("string");
  }),
  priority: 0,
  renderer: ({ schema, ...props }) => {
    const schemaJson = schema.toJSON();
    if (typeof schemaJson === "boolean") {
      return null;
    }

    return (
      <BaseStringRenderer
        schema={schema}
        {...props}
        type="text"
        min={schemaJson.minLength}
        max={schemaJson.maxLength}
        regex={schemaJson.pattern}
      />
    );
  },
};

export const stringRenderers = [defaultStringRenderer, ...formats];
