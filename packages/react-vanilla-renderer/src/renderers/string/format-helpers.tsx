import {
  BaseRendererProps,
  FormJsonSchema,
  SchemaRenderer,
} from "@phalleux/jsf-core";
import { Tester } from "@phalleux/jsf-schema-utils";

import {
  BaseStringRenderer,
  BaseStringRendererProps,
} from "./BaseStringRenderer.tsx";

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
    schema: FormJsonSchema,
  ) => Omit<BaseStringRendererProps, keyof BaseRendererProps>;
}): SchemaRenderer => ({
  tester: Array.isArray(format)
    ? (schema) => format.map(Tester.isStringFormatSchema).some((t) => t(schema))
    : Tester.isStringFormatSchema(format),
  priority,
  renderer: ({ schema, path }) => (
    <BaseStringRenderer
      schema={schema}
      path={path}
      type="text"
      min={schema.minLength}
      max={schema.maxLength}
      regex={schema.pattern}
      {...getProps(schema)}
    />
  ),
});
