import type { BaseRendererProps, SchemaRenderer } from "@phalleux/jsf-core";
import type { ObjectSchema } from "@phalleux/jsf-schema-utils";
import { Tester } from "@phalleux/jsf-schema-utils";

import type { BaseStringRendererProps } from "./BaseStringRenderer.tsx";
import { BaseStringRenderer } from "./BaseStringRenderer.tsx";

/**
 * Create a renderer for a specific format
 * @param format - the format to match
 * @param priority - the priority of the renderer
 * @param getProps - a function that returns the props to pass to the renderer
 */
export const createFormatRenderer = ({
  format,
  priority = 1,
  getProps,
}: {
  format: string | string[];
  priority?: number;
  getProps: (
    schema: ObjectSchema,
  ) => Omit<BaseStringRendererProps, keyof BaseRendererProps>;
}): SchemaRenderer => ({
  id: `react-vanilla.string.format.${format}`,
  tester: Tester((builder) => {
    builder.withType("string");
    if (Array.isArray(format)) {
      format.forEach((f) => builder.withFormat(f));
    } else {
      builder.withFormat(format);
    }
  }),
  priority,
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
