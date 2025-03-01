import type { BaseRendererProps, SchemaRenderer } from "@phalleux/jsf-core";
import { isBooleanStartSchema, Tester } from "@phalleux/jsf-schema-utils";

import { RenderSchema } from "../adapter";

const objectTester = Tester((builder) => {
  builder.withType("object");
});

export const objectRenderer: SchemaRenderer = {
  id: "react.builtin.object",
  tester: objectTester,
  priority: 10,
  renderer: function ObjectRenderer({
    schema,
    path,
    ...props
  }: BaseRendererProps) {
    if (!schema.properties) {
      return null;
    }

    return Object.entries(schema.properties).map(([key, property]) => {
      if (isBooleanStartSchema(property)) {
        return null;
      }

      return (
        <RenderSchema
          key={key}
          schema={property}
          path={`${path}.${key}`}
          {...props}
          parentSchema={schema}
        />
      );
    });
  },
};
