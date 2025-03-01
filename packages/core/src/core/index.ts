import Ajv from "ajv";
import addFormats, { type FormatName } from "ajv-formats";
import { formatNames } from "ajv-formats/dist/formats";
import { castDraft } from "immer";
import { RefResolver } from "json-schema-ref-resolver";
import { get, merge, set } from "lodash";

import {
  isBooleanStartSchema,
  SchemaDefault,
} from "@phalleux/jsf-schema-utils";

import { createDefaultStore, createStoreUpdater } from "../store";
import type {
  Form,
  FormCoreApi,
  FormOptions,
  FormState,
  InitFormOptions,
} from "../types/core.ts";
import type { FormJsonSchema } from "../types/schema.ts";
import { getValuePath } from "../utils/error.ts";

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

  const ajv = new Ajv({ strict: false });

  addFormats(ajv, { formats: VALIDATED_FORMATS, keywords: true });

  const sortedRenderers = (resolvedOptions.renderers ?? [])?.sort(
    (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
  );

  // Define validation for all renderers
  for (const sortedRenderersKey in sortedRenderers) {
    const renderer = sortedRenderers[sortedRenderersKey];
    if (renderer?.defineValidation) {
      renderer.defineValidation(ajv);
    }
  }

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
      const sanitizedPath = path.startsWith(".") ? path.slice(1) : path;
      if (sanitizedPath === "") {
        return store.getState().value;
      }
      return get(store.getState().value, sanitizedPath) ?? null;
    },
    setFieldValue: (path, value) => {
      const sanitizedPath = path.startsWith(".") ? path.slice(1) : path;
      storeUpdater((state) => {
        if (sanitizedPath === "") {
          state.value = value;
        } else if (
          typeof state.value === "object" ||
          typeof state.value === "undefined" ||
          state.value === null
        ) {
          state.value = set(state.value ?? {}, sanitizedPath, value);
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
    getRenderer: (schema, previousRenderers) => {
      const renderer = sortedRenderers
        .filter((renderer) => !previousRenderers.includes(renderer.id))
        .find((renderer) => renderer.tester(schema));
      return renderer?.renderer ?? null;
    },

    // Validation
    isRequired: (path: string, parentSchema?: FormJsonSchema) => {
      const schema = parentSchema ?? store.getState().schema;
      const fieldName = path.split(".").at(-1);
      if (!fieldName) {
        return false;
      }
      return schema.required?.includes(fieldName) ?? false;
    },
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
      return errors.filter((error) => getValuePath(error) === path);
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
