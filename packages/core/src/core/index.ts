import Ajv from "ajv";
import addFormats, { type FormatName } from "ajv-formats";
import { formatNames } from "ajv-formats/dist/formats";
import { castDraft, enableMapSet } from "immer";
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
import type { SchemaRenderer } from "../types/renderer.ts";
import type { FormJsonSchema } from "../types/schema.ts";
import { errorToJsonPath } from "../utils/error.ts";

enableMapSet();

const VALIDATED_FORMATS: FormatName[] = formatNames.filter(
  (format) => format !== "time" && format !== "date-time",
);

const DEFAULT_STATE: FormState = {
  refResolver: new RefResolver(),
  schema: {},
  value: {},
  errors: null,
  flags: new Map<string, boolean>(),
  renderers: [],
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

  const state = merge({}, DEFAULT_STATE, {
    renderers: sortRenderers(resolvedOptions.renderers ?? []),
  });

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
      const pathArray = path.split("/").filter((p) => p !== "");
      if (pathArray.length === 0) {
        return store.getState().value;
      }
      return get(store.getState().value, pathArray) ?? null;
    },
    setFieldValue: (path, value) => {
      const pathArray = path.split("/").filter((p) => p !== "");
      storeUpdater((state) => {
        if (pathArray.length === 0) {
          state.value = value;
        } else if (
          typeof state.value === "object" ||
          typeof state.value === "undefined" ||
          state.value === null
        ) {
          state.value = set(state.value ?? {}, pathArray, value);
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
    getFieldPath: (parentPath, key) => {
      if (parentPath === undefined) {
        return "";
      }

      if (key === undefined) {
        return parentPath;
      }

      return `${parentPath}/${key}`;
    },

    // Rendering
    getRenderer: (schema, previousRenderers) => {
      const { renderers } = store.getState();
      const renderer = renderers
        .filter((renderer) => !previousRenderers.includes(renderer.id))
        .find((renderer) => renderer.tester(schema));
      return renderer ?? null;
    },
    setRenderers: (renderers) => {
      storeUpdater((state) => {
        state.renderers = sortRenderers(renderers);
      });
    },
    addRenderer: (renderer) => {
      storeUpdater((state) => {
        state.renderers.push(renderer);
        state.renderers = sortRenderers(state.renderers);
      });

      if (renderer?.defineValidation) {
        // TODO: clean validation on renderer removal
        renderer.defineValidation(ajv);
      }
    },
    removeRenderer: (id) => {
      storeUpdater((state) => {
        state.renderers = state.renderers.filter(
          (renderer) => renderer.id !== id,
        );
        state.renderers = sortRenderers(state.renderers);
      });
    },
    hasRenderer: (id) => {
      return store.getState().renderers.some((renderer) => renderer.id === id);
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
      return errors.filter((error) => errorToJsonPath(error) === path);
    },

    // Flags
    getFlag: (key: string) => {
      return store.getState().flags.get(key) ?? false;
    },
    setFlag: (key: string, value: boolean) => {
      storeUpdater((state) => {
        state.flags.set(key, value);
      });
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

const sortRenderers = (renderers: SchemaRenderer[]) => {
  return renderers.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
};
