import { useMemo } from "react";

import type { BaseRendererProps, SchemaRenderer } from "@phalleux/jsf-core";
import {
  AllOfMerger,
  isBooleanStartSchema,
  Tester,
} from "@phalleux/jsf-schema-utils";

import { RenderSchema } from "../adapter";

const allOfTester = Tester((builder) => {
  builder.add((schema) => schema.allOf !== undefined);
});

export const allOfRenderer: SchemaRenderer = {
  id: "react.builtin.allOf",
  tester: allOfTester,
  priority: 10,
  renderer: function AllOfRenderer({ schema, ...props }: BaseRendererProps) {
    const merged = useMemo(() => {
      const merged = AllOfMerger.merge(schema);
      if (isBooleanStartSchema(merged)) {
        return {};
      }
      return merged;
    }, [schema]);

    return <RenderSchema schema={merged} {...props} />;
  },
};
