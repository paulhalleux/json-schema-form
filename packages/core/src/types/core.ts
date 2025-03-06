import type { ObjectSchema } from "@phalleux/jsf-schema-utils";
import { Schema } from "@phalleux/jsf-schema-utils";

import type { Register } from "./register.ts";
import type { SchemaRenderer } from "./renderer.ts";
import type { StoreApi, StoreUpdater } from "./store.ts";

export type AnySchemaValue =
  | string
  | number
  | boolean
  | null
  | Record<string, any>
  | any[];

/**
 * {@link FormState}
 * ---
 * This type is used to define the state of the form
 */
export interface FormState {
  schema: Schema<ObjectSchema>;
  value: AnySchemaValue;
  flags: Map<string, boolean>;
  renderers: SchemaRenderer[];
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
  schema: ObjectSchema;
  defaultValue?: AnySchemaValue;
  additionalReferences?: Record<string, ObjectSchema>;
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
  getSchema: () => Schema<ObjectSchema>;
  setSchema: (schema: ObjectSchema) => void;

  // Rendering
  getRenderer: (
    schema: ObjectSchema,
    previousRenderers: string[],
  ) => SchemaRenderer | null;

  // Flags
  setFlag: (flag: string, value: boolean) => void;
  getFlag: (flag: string) => boolean;
}

export type FormStoreFactory = (initialState: FormState) => FormStore;
