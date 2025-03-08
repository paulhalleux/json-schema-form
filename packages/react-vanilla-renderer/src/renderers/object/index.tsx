import type { SchemaRenderer } from "@phalleux/jsf-core";
import { Priorities, RenderSchema } from "@phalleux/jsf-react";
import { createTester, test } from "@phalleux/jsf-schema-utils";

import { SchemaHeader } from "../../components";

const objectTester = createTester(Priorities.OBJECT + 1, test.object);

export const defaultObjectRenderer: SchemaRenderer = {
  id: "react-vanilla.object.default",
  tester: objectTester,
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
