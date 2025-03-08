import type { SchemaRenderer } from "@phalleux/jsf-core";
import { createTester, test } from "@phalleux/jsf-schema-utils";

import { BaseStringRenderer } from "./BaseStringRenderer.tsx";
import { formats } from "./formats";

const stringTester = createTester(0, test.string);

const defaultStringRenderer: SchemaRenderer = {
  id: "react-vanilla.string.default",
  tester: stringTester,
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
