import {
  BaseRendererProps,
  FormJsonSchema,
  SchemaRenderer,
} from "@phalleux/jsf-core";
import { Tester } from "@phalleux/jsf-schema-utils";

import {
  BaseStringFieldProps,
  BaseStringRenderer,
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
  format: string;
  priority?: number;
  getProps: (
    schema: FormJsonSchema,
  ) => Omit<BaseStringFieldProps, keyof BaseRendererProps>;
}): SchemaRenderer => ({
  tester: Tester.isStringFormatSchema(format),
  priority,
  renderer: ({ schema, path }) => (
    <BaseStringRenderer schema={schema} path={path} {...getProps(schema)} />
  ),
});
