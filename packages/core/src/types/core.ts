import type { ErrorObject } from "ajv";
import type { RefResolver } from "json-schema-ref-resolver";

import type { AnySchemaValue } from "@phalleux/jsf-schema-utils";

import type { Register } from "./register.ts";
import type { RendererType, SchemaRenderer } from "./renderer.ts";
import type { FormJsonSchema } from "./schema.ts";
import type { StoreApi, StoreUpdater } from "./store.ts";

/**
 * {@link FormState}
 * ---
 * This type is used to define the state of the form
 */
export interface FormState {
  refResolver: RefResolver;
  schema: FormJsonSchema;
  value: AnySchemaValue;
  errors: ErrorObject[] | null;
}

/**
 * {@link FormStore}
 * ---
 * This type is used to define the store of the form
 * It is deduced from the register type, and defaults to the default {@link StoreApi}
 */
export type FormStore = Register extends {
  store: infer S extends StoreApi<FormState>;
}
  ? S
  : StoreApi<FormState>;

/**
 * {@link FormOptions}
 * ---
 * This type is used to define the options of the form
 */
export type FormOptions = {
  createStore: FormStoreFactory;
  schema: FormJsonSchema;
  defaultValue?: AnySchemaValue;
  references?: Record<string, FormJsonSchema>;
  renderers?: Array<SchemaRenderer>;
};

/**
 * {@link InitFormOptions}
 * ---
 * This type is used to define the options of the form when initializing
 */
export type InitFormOptions = Partial<FormOptions>;

/**
 * {@link FormCoreApi}
 * ---
 * This type is used to define the form core API
 * It includes the store and the store updater.
 */
export type FormCoreApi = {
  store: FormStore;
  update: StoreUpdater<FormState>;
};

/**
 * {@link Form}
 * ---
 * This type is used to define the form API
 * It includes the form core API and features like validation, submission, etc.
 */
export interface Form extends FormCoreApi {
  // Global value management
  setValue: (value: AnySchemaValue) => void;
  getValue: () => AnySchemaValue;

  // Field value management
  setFieldValue: (path: string, value: AnySchemaValue) => void;
  getFieldValue: (path: string) => AnySchemaValue | null;

  // Schema management
  getSchema: () => FormJsonSchema;
  setSchema: (schema: FormJsonSchema) => void;
  getRefSchema: (path: string) => FormJsonSchema | null;

  // Validation
  isRequired: (path: string, parentSchema?: FormJsonSchema) => boolean;
  validate: () => true | ErrorObject[];
  getFieldErrors: (path: string) => ErrorObject[];

  // Rendering
  getRenderer: (
    schema: FormJsonSchema,
    previousRenderers: string[],
  ) => RendererType | null;
}

export type FormStoreFactory = (initialState: FormState) => FormStore;
