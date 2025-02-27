import { RefResolver } from "json-schema-ref-resolver";

import {
  AnySchemaValue,
  BaseJsonSchema,
  NonBooleanBaseJsonSchema,
} from "../types/schema.ts";

import { AllOfMerger } from "./all-of-merger.ts";
import { OneOfSplitter } from "./one-of-splitter.ts";
import { isBooleanStartSchema } from "./testers.ts";

/**
 * Options for getting the default value
 */
export enum SchemaDefaultMode {
  /**
   * Use default value if available
   */
  SchemaDefault = "schema-default",
  /**
   * Use default value or deduce from schema type
   */
  TypeDefault = "type-default",
  /**
   * Use default value if available, or null if not
   */
  Null = "null",
}

/**
 * Options for getting the default value
 */
export type GetDefaultValueOptions = {
  /**
   * Resolution mode
   */
  mode?: SchemaDefaultMode;
  /**
   * Ref resolver
   */
  refResolver?: RefResolver;
};

export const SchemaDefault = {
  /**
   * Get the default value from a schema
   * @param schema - The schema to get the default value from
   * @param options - The options for getting the default value
   */
  get<Ext extends {}>(
    schema: BaseJsonSchema<Ext>,
    options: GetDefaultValueOptions = {
      mode: SchemaDefaultMode.SchemaDefault,
      refResolver: new RefResolver(),
    },
  ): AnySchemaValue | undefined {
    const inner = (
      schema: BaseJsonSchema<Ext>,
      options: GetDefaultValueOptions = {},
      parentRefs: Set<string> = new Set(),
    ) => {
      if (isBooleanStartSchema(schema)) {
        return schema;
      }

      const {
        mode = SchemaDefaultMode.SchemaDefault,
        refResolver = new RefResolver(),
      } = options;

      // Get the default value from the schema if available
      if (schema.default !== undefined) {
        return schema.default;
      }

      // Get the default value from the schema type
      if (schema.type === "object") {
        // If the schema is an object, return the default value if there are no properties
        if (!schema.properties) {
          return SchemaDefault.getDefaultForMode(
            mode ?? SchemaDefaultMode.SchemaDefault,
            schema,
          );
        }

        // Else, recursively get the default value for each property
        const defaultValue: Record<string, AnySchemaValue> = {};
        for (const [key, property] of Object.entries(schema.properties)) {
          const propertyValue = inner(property, options, parentRefs);
          if (propertyValue !== undefined) {
            defaultValue[key] = propertyValue;
          }
        }

        // If there are no properties with default values, return the default value for the mode
        if (Object.keys(defaultValue).length === 0) {
          return SchemaDefault.getDefaultForMode(
            mode ?? SchemaDefaultMode.SchemaDefault,
            schema,
          );
        }

        return defaultValue;
      }

      if (schema.type === "array") {
        // If the schema is an array, return the default value if there are no items
        if (!schema.items) {
          return SchemaDefault.getDefaultForMode(
            mode ?? SchemaDefaultMode.SchemaDefault,
            schema,
          );
        }

        const count = schema.minItems ?? 0;
        const defaultValue: (AnySchemaValue | undefined)[] = [];
        const defaultArrayValue =
          mode === SchemaDefaultMode.Null ? null : undefined;
        if (Array.isArray(schema.items)) {
          const resolvedItems = schema.items.map(
            (item) => inner(item, options, parentRefs) ?? defaultArrayValue,
          );
          for (let i = 0; i < count; i++) {
            defaultValue.push(
              resolvedItems[i % resolvedItems.length] ?? defaultArrayValue,
            );
          }
        } else {
          const itemValue = inner(schema.items, options, parentRefs);

          for (let i = 0; i < count; i++) {
            defaultValue.push(itemValue ?? defaultArrayValue);
          }
        }

        return defaultValue.filter((value) => value !== undefined);
      }

      // If the schema is a reference, resolve the reference
      if (schema.$ref) {
        if (parentRefs.has(schema.$ref)) {
          return mode === SchemaDefaultMode.Null ? null : undefined;
        }

        parentRefs.add(schema.$ref);

        try {
          const resolved = refResolver.getDerefSchema(schema.$ref);
          if (!resolved) {
            return mode === SchemaDefaultMode.Null ? null : undefined;
          }
          return inner(resolved, options, parentRefs);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
          return mode === SchemaDefaultMode.Null ? null : undefined;
        }
      }

      if (schema.allOf) {
        const merged = AllOfMerger.merge(schema);
        return inner(merged, options, parentRefs);
      }

      if (schema.oneOf) {
        const split = OneOfSplitter.split<Ext>(schema);
        const merged = AllOfMerger.merge<Ext>({
          allOf: split,
        } as BaseJsonSchema<Ext>);
        return inner(merged, options, parentRefs);
      }

      return SchemaDefault.getDefaultForMode(
        mode ?? SchemaDefaultMode.SchemaDefault,
        schema,
      );
    };

    return inner(schema, options);
  },
  /**
   * Get the default value from a schema type
   * @param schema - The schema to get the default value from
   */
  getDefaultValueFromSchemaType<Extension extends {}>(
    schema: NonBooleanBaseJsonSchema<Extension>,
  ): AnySchemaValue {
    if (schema.enum?.length) {
      return schema.enum[0] as AnySchemaValue;
    }

    switch (schema.type) {
      case "string":
        return "";
      case "number":
        return 0;
      case "integer":
        return 0;
      case "boolean":
        return false;
      case "null":
        return null;
      case "array":
        return [];
      case "object":
        return {};
      default:
        return null;
    }
  },
  /**
   * Get the default value for a resolution mode
   * @param mode - The resolution mode
   * @param schema - The schema to get the default value from
   */
  getDefaultForMode: (mode: SchemaDefaultMode, schema: BaseJsonSchema) => {
    if (mode === SchemaDefaultMode.TypeDefault) {
      return SchemaDefault.getDefaultValueFromSchemaType(
        schema as NonBooleanBaseJsonSchema,
      );
    } else if (mode === SchemaDefaultMode.Null) {
      return null;
    }
    return undefined;
  },
};
