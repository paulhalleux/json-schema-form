import type { Ajv } from "ajv";

import type { SchemaTester } from "@phalleux/jsf-schema-utils";

import type { Register } from "./register.ts";
import type { FormJsonSchema } from "./schema.ts";

/**
 * Base renderer props
 * ---
 * This type is used to define the base props for a renderer
 */
export type BaseRendererProps = {
  /**
   * The path of the schema
   */
  path: string;
  /**
   * The schema to render
   */
  schema: FormJsonSchema;
  /**
   * The parent schema of the current schema
   */
  parentSchema: FormJsonSchema | undefined;

  /**
   * The previous renderers that were used
   * This is used to allow for the renderer to know what renderers were used before
   * and avoid rendering the same renderer multiple times for the same schema
   */
  previousRenderers: string[];
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
  /**
   * The id of the renderer
   * This is used to identify the renderer.
   * It should be unique for each renderer.
   */
  id: string;
  /**
   * The priority of the renderer
   * Higher priority renderers will be used first
   */
  priority?: number;
  /**
   * The tester to determine if the renderer should be used
   */
  tester: SchemaTester;
  /**
   * The renderer to render the schema
   */
  renderer: RendererType;
  /**
   * Define validation for the schema
   * @param ajv The ajv instance to define validation
   */
  defineValidation?: (ajv: Ajv) => void;
};
