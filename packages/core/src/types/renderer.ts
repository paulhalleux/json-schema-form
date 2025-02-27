import { SchemaTester } from "@phalleux/jsf-schema-utils";

import { Register } from "./register.ts";
import { FormJsonSchema } from "./schema.ts";

/**
 * Base renderer props
 * ---
 * This type is used to define the base props for a renderer
 */
export type BaseRendererProps = {
  path: string;
  schema: FormJsonSchema;
};

/**
 * Type that a renderer should return
 * ---
 * This type is used to define the return type of renderers
 * This is extracted from the register type to allow for easier extension in any framework
 */
export type RendererType = Register extends {
  rendererType: infer R;
}
  ? R
  : never;

/**
 * Schema renderer
 * ---
 * This type is used to define a schema renderer
 * It defines the priority, tester and renderer for a schema renderer
 */
export type SchemaRenderer = {
  priority: number;
  tester: SchemaTester;
  renderer: RendererType;
};
