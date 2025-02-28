import { SchemaRenderer } from "@phalleux/jsf-core";
import { RenderSchema } from "@phalleux/jsf-react";
import { Tester } from "@phalleux/jsf-schema-utils";

const defaultObjectRenderer: SchemaRenderer = {
  id: "react-vanilla.object.default",
  tester: Tester((builder) => {
    builder.withType("object");
  }),
  priority: 11,
  renderer: ({ schema, previousRenderers, ...props }) => (
    <div className="space-y-2">
      <header>
        <h1 className="text-md font-medium">{schema.title}</h1>
        <p className="text-sm text-neutral-700">{schema.description}</p>
      </header>
      <div className="flex flex-col space-y-2">
        <RenderSchema
          schema={schema}
          {...props}
          previousRenderers={[...previousRenderers, defaultObjectRenderer.id]}
        />
      </div>
    </div>
  ),
};

export const objectRenderers = [defaultObjectRenderer];
