import { castDraft, enableMapSet } from "immer";
import { get, merge, set } from "lodash";

import { type ObjectSchema, Schema } from "@phalleux/jsf-schema-utils";

import { createDefaultStore, createStoreUpdater } from "../store";
import type {
  Form,
  FormCoreApi,
  FormOptions,
  FormState,
  InitFormOptions,
} from "../types/core.ts";

enableMapSet();

const DEFAULT_STATE: FormState = {
  schema: new Schema({}),
  value: {},
  flags: new Map<string, boolean>(),
};

const DEFAULT_OPTIONS: FormOptions = {
  createStore: createDefaultStore,
  schema: {},
  defaultValue: undefined,
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

  const store = resolvedOptions.createStore(DEFAULT_STATE);
  const storeUpdater = createStoreUpdater(store);

  // Create the form core
  const api: FormCoreApi = {
    store,
    update: storeUpdater,
  };

  const setSchema = (schema: ObjectSchema) => {
    storeUpdater((state) => {
      state.schema = new Schema(schema);
      for (const ref of resolvedOptions.additionalReferences ?? []) {
        state.schema.registerDefinition(ref);
      }
      state.value = null;
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
      const normalizedPath = path.replace(/^\./, "");
      const formValue = store.getState().value;

      if (normalizedPath.length === 0) {
        return formValue;
      }
      if (formValue === null || typeof formValue !== "object") {
        return null;
      }

      return get(formValue, normalizedPath) ?? null;
    },
    setFieldValue: (path, value) => {
      const normalizedPath = path.replace(/^\./, "");
      storeUpdater((state) => {
        if (normalizedPath.length === 0) {
          state.value = value;
        } else if (
          typeof state.value === "object" ||
          typeof state.value === "undefined" ||
          state.value === null
        ) {
          state.value = set(state.value ?? {}, normalizedPath, value);
        }
      });
    },

    // Schema management
    getSchema: () => store.getState().schema,
    setSchema,

    // Rendering
    getRenderer: (schema, previousRenderers) => {
      const { renderers = [] } = resolvedOptions;
      const matchingRenderers = renderers
        .filter((renderer) => !previousRenderers.includes(renderer.id))
        .filter((renderer) => renderer.tester(schema));

      console.log(matchingRenderers);

      return (
        matchingRenderers.sort(
          (a, b) => b.tester.priority - a.tester.priority,
        )[0] ?? null
      );
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
