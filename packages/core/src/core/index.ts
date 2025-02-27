import { getSchemaDefaultValue } from "@phalleux/jsf-schema-utils";
import Ajv from "ajv";
import addFormats, { FormatName } from "ajv-formats";
import { formatNames } from "ajv-formats/dist/formats";
import { castDraft } from "immer";
import { get, merge, set } from "lodash";

import { createDefaultStore, createStoreUpdater } from "../store";
import {
  Form,
  FormCoreApi,
  FormOptions,
  FormState,
  InitFormOptions,
} from "../types/core.ts";
import { JSONSchema } from "../types/schema.ts";

const VALIDATED_FORMATS: FormatName[] = formatNames.filter(
  (format) => format !== "time" && format !== "date-time",
);

const DEFAULT_STATE: FormState = {
  schema: {},
  value: {},
  errors: null,
};

const DEFAULT_OPTIONS: FormOptions = {
  createStore: createDefaultStore,
  schema: {},
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

  const ajv = new Ajv({
    formats: {
      time: true,
      "date-time": true,
    },
  });

  addFormats(ajv, { formats: VALIDATED_FORMATS });

  const state = merge({}, DEFAULT_STATE);
  const store = resolvedOptions.createStore(state);
  const storeUpdater = createStoreUpdater(store);

  // Create the form core
  const api: FormCoreApi = {
    store,
    update: storeUpdater,
  };

  const setSchema = (schema: JSONSchema) => {
    storeUpdater((state) => {
      state.schema = schema;
      state.value = getSchemaDefaultValue(schema);
      state.errors = null;
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
