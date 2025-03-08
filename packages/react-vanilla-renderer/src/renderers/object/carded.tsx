import type { SchemaRenderer } from "@phalleux/jsf-core";
import { Priorities, RenderSchema } from "@phalleux/jsf-react";
import { createTester, test } from "@phalleux/jsf-schema-utils";

const objectTester = createTester(
  Priorities.OBJECT + 2,
  test.and(test.object, (schema) => schema["x-renderer"] === "carded"),
);

export const cardedObjectRenderer: SchemaRenderer = {
  id: "react-vanilla.object.carded",
  tester: objectTester,
  renderer: (props) => {
    return (
      <div className="p-2 rounded-sm border border-neutral-300">
        <RenderSchema {...props} />
      </div>
    );
  },
};
