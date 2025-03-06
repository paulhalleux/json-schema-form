import type { SchemaRenderer } from "@phalleux/jsf-core";
import { RenderSchema } from "@phalleux/jsf-react";
import { Tester } from "@phalleux/jsf-schema-utils";

import { SchemaHeader } from "../../components";

const defaultObjectRenderer: SchemaRenderer = {
  id: "react-vanilla.object.default",
  tester: Tester((builder) => {
    builder.withType("object");
  }),
  priority: 11,
  renderer: ({ schema, ...props }) => {
    const jsonSchema = schema.toJSON();
    return (
      <div className="space-y-2 w-full">
        <SchemaHeader
          title={jsonSchema.title}
          description={jsonSchema.description}
        />
        <div className="flex flex-col space-y-2 w-full">
          <RenderSchema schema={schema} {...props} />
        </div>
      </div>
    );
  },
};

export const objectRenderers = [defaultObjectRenderer];
