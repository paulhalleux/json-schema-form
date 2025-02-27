import { AnySchemaValue } from "@phalleux/jsf-schema-utils";
import { ErrorObject } from "ajv";
import { RefResolver } from "json-schema-ref-resolver";

import { Register } from "./register.ts";
import { RendererType, SchemaRenderer } from "./renderer.ts";
import { FormJsonSchema } from "./schema.ts";
import { StoreApi, StoreUpdater } from "./store.ts";

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
  validate: () => true | ErrorObject[];
  getFieldErrors: (path: string) => ErrorObject[];

  // Rendering
  getRenderer: (schema: FormJsonSchema) => RendererType | null;
}

export type FormStoreFactory = (initialState: FormState) => FormStore;
