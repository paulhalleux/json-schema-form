import type { BaseRendererProps, SchemaRenderer } from "@phalleux/jsf-core";
import {
  createTester,
  type ObjectSchema,
  type SchemaTesterFn,
  test,
} from "@phalleux/jsf-schema-utils";

import type { BaseStringRendererProps } from "./BaseStringRenderer.tsx";
import { BaseStringRenderer } from "./BaseStringRenderer.tsx";

/**
 * Create a renderer for a specific format
 * @param format - the format to match
 * @param priority - the priority of the renderer
 * @param getProps - a function that returns the props to pass to the renderer
 */
export const createFormatRenderer = ({
  id,
  tester,
  priority = 1,
  getProps,
}: {
  id: string;
  tester: SchemaTesterFn;
  priority?: number;
  getProps: (
    schema: ObjectSchema,
  ) => Omit<BaseStringRendererProps, keyof BaseRendererProps>;
}): SchemaRenderer => ({
  id: `react-vanilla.string.format.${id}`,
  tester: createTester(priority, test.and(test.string, tester)),
  renderer: ({ schema, ...props }) => {
    const schemaJson = schema.toJSON();
    return (
      <BaseStringRenderer
        schema={schema}
        {...props}
        type="text"
        min={schemaJson.minLength}
        max={schemaJson.maxLength}
        regex={schemaJson.pattern}
        {...getProps(schemaJson)}
      />
    );
  },
});
