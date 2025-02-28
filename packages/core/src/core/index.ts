import { isBooleanStartSchema } from "@phalleux/jsf-schema-utils";
import { SchemaDefault } from "@phalleux/jsf-schema-utils/src";
import Ajv from "ajv";
import addFormats, { FormatName } from "ajv-formats";
import { formatNames } from "ajv-formats/dist/formats";
import { castDraft } from "immer";
import { RefResolver } from "json-schema-ref-resolver";
import { get, merge, set } from "lodash";

import { createDefaultStore, createStoreUpdater } from "../store";
import {
  Form,
  FormCoreApi,
  FormOptions,
  FormState,
  InitFormOptions,
} from "../types/core.ts";
import { FormJsonSchema } from "../types/schema.ts";

const VALIDATED_FORMATS: FormatName[] = formatNames.filter(
  (format) => format !== "time" && format !== "date-time",
);

const DEFAULT_STATE: FormState = {
  refResolver: new RefResolver(),
  schema: {},
  value: {},
  errors: null,
};

const DEFAULT_OPTIONS: FormOptions = {
  createStore: createDefaultStore,
  schema: {},
  defaultValue: undefined,
  references: {},
  renderers: [],
};

/**
 * Create a new form
 * ---
 * This function is used to create a new form
 * @param options - Form options
 * @returns Form API instance
 */
export function createForm(options: InitFormOptions = {}): Form {
  const resolvedOptions = merge({}, DEFAULT_OPTIONS, options) as FormOptions;

  const ajv = new Ajv();

  addFormats(ajv, { formats: VALIDATED_FORMATS, keywords: true });

  const sortedRenderers = (resolvedOptions.renderers ?? [])?.sort(
    (a, b) => b.priority - a.priority,
  );

  const state = merge({}, DEFAULT_STATE);
  const store = resolvedOptions.createStore(state);
  const storeUpdater = createStoreUpdater(store);

  // Create the form core
  const api: FormCoreApi = {
    store,
    update: storeUpdater,
  };

  const setSchema = (schema: FormJsonSchema) => {
    storeUpdater((state) => {
      state.schema = schema;
      state.errors = null;
      state.refResolver = createRefResolver(
        resolvedOptions.references ?? {},
        schema,
      );

      state.value =
        SchemaDefault.get(schema, {
          refResolver: state.refResolver,
        }) ?? null;
    });
  };

  setSchema(resolvedOptions.schema);

  return {
    ...api,

    // Global value management
    getValue: () => store.getState().value,
    setValue: (value) => {
      storeUpdater((state) => {
        state.value = castDraft(value);
      });
    },

    // Field value management
    getFieldValue: (path: string) => {
      if (path === "") {
        return store.getState().value;
      }
      return get(store.getState().value, path) ?? null;
    },

    setFieldValue: (path, value) => {
      storeUpdater((state) => {
        if (path === "") {
          state.value = value;
        } else if (
          typeof state.value === "object" ||
          typeof state.value === "undefined" ||
          state.value === null
        ) {
          state.value = set(state.value ?? {}, path, value);
        }
      });
    },

    // Schema management
    getSchema: () => store.getState().schema,
    setSchema,
    getRefSchema: (path) => {
      const refSchema = store.getState().refResolver.getDerefSchema(path);
      if (refSchema) {
        return refSchema;
      }
      return null;
    },

    // Rendering
    getRenderer: (schema) => {
      const renderer = sortedRenderers.find((renderer) =>
        renderer.tester(schema),
      );
      return renderer?.renderer ?? null;
    },

    // Validation
    validate: () => {
      const _validate = () => {
        const validate = ajv.compile(store.getState().schema);
        if (validate(store.getState().value)) {
          return true;
        } else {
          if (validate.errors) {
            return validate.errors;
          }
          return [];
        }
      };

      const result = _validate();
      storeUpdater((state) => {
        state.errors = result === true ? null : result;
      });
      return result;
    },
    getFieldErrors: (path: string) => {
      const errors = store.getState().errors;
      if (errors === null) {
        return [];
      }
      if (path === "") {
        return errors;
      }
      return errors.filter((error) => error.instancePath === path);
    },
  };
}

const createRefResolver = (
  references: Record<string, FormJsonSchema>,
  schema: FormJsonSchema,
) => {
  const refResolver = new RefResolver();

  Object.entries(references).forEach(([key, value]) => {
    refResolver.addSchema(value, value.$id ?? key);
  });

  if (schema.$defs) {
    Object.entries(schema.$defs).forEach(([key, value]) => {
      if (isBooleanStartSchema(value)) {
        return;
      }
      refResolver.addSchema(value, value.$id ?? `#/$defs/${key}`);
    });
  }

  if (schema.definitions) {
    Object.entries(schema.definitions).forEach(([key, value]) => {
      if (isBooleanStartSchema(value)) {
        return;
      }
      refResolver.addSchema(value, value.$id ?? `#/definitions/${key}`);
    });
  }

  return refResolver;
};
