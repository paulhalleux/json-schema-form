import { useMemo } from "react";
import { BaseRendererProps, SchemaRenderer } from "@phalleux/jsf-core";
import { isBooleanStartSchema, Tester } from "@phalleux/jsf-schema-utils";
import { merge, omit } from "lodash";

import { RenderSchema, useFormInstance } from "../adapter";

const refTester = Tester((builder) => {
  builder.add((schema) => schema.$ref !== undefined);
});

export const refRenderer: SchemaRenderer = {
  id: "react.builtin.ref",
  tester: refTester,
  priority: 10,
  renderer: function RedRenderer({ schema, ...props }: BaseRendererProps) {
    const instance = useFormInstance();

    const resolved = useMemo(() => {
      if (schema.$ref === undefined) {
        return {};
      }
      const resolved = instance.getRefSchema(schema.$ref);
      if (isBooleanStartSchema(resolved) || !resolved) {
        return {};
      }
      return merge({}, resolved, omit(schema, ["$ref"]));
    }, [instance, schema]);

    return <RenderSchema schema={resolved} {...props} />;
  },
};
