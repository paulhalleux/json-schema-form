import type { BaseRendererProps, SchemaRenderer } from "@phalleux/jsf-core";
import { Tester } from "@phalleux/jsf-schema-utils";

import { RenderSchema } from "../adapter";

const objectTester = Tester((builder) => {
  builder.withType("object");
});

export const objectRenderer: SchemaRenderer = {
  id: "react.builtin.object",
  tester: objectTester,
  priority: 10,
  renderer: function ObjectRenderer({ schema, path }: BaseRendererProps) {
    const jsonSchema = schema.toJSON();
    if (!jsonSchema.properties) {
      return null;
    }

    return Object.entries(jsonSchema.properties).map(([key]) => {
      const subSchema = schema.getSubSchema(`#/properties/${key}`);
      if (!subSchema || subSchema.isBooleanSchema()) return null;
      return (
        <RenderSchema
          key={key}
          path={path === "" ? key : `${path}.${key}`}
          schema={subSchema.asObjectSchema()}
          previousRenderers={[]}
        />
      );
    });
  },
};
