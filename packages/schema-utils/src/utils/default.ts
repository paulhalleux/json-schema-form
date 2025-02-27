import {
  AnySchemaValue,
  JSONSchema,
  NonBooleanJSONSchema,
} from "../types/schema.ts";

import { getLocalRef, mergeAllOfs, mergeDefinitions } from "./resolve.ts";

/**
 * Options for getting the default value
 */
export type GetDefaultValueOptions<Extension extends {}> = {
  /**
   * Additional definitions to merge
   */
  additionalDefinitions?: Record<string, JSONSchema<Extension>>;
  /**
   * Resolution mode
   * - schema-default: Use default value if available
   * - type-default: Use default value or deduce from schema type
   * - null: Use default value if available, or null if not
   */
  mode?: "schema-default" | "type-default" | "null";
  /**
   * Maximum recursion depth for references
   */
  maxRefDepth?: number;
};

/**
 * Get the default value from a schema
 * @param schema - The schema to get the default value from
 * @param options - The options for getting the default value
 */
export function getSchemaDefaultValue<Extension extends {}>(
  schema: JSONSchema<Extension>,
  options: GetDefaultValueOptions<Extension> = {},
): AnySchemaValue {
  function inner<Extension extends {}>(
    schema: JSONSchema<Extension>,
    options: GetDefaultValueOptions<Extension> = {},
    refDepth: number = 0,
    parentRefs: Set<string> = new Set(),
  ): AnySchemaValue | undefined {
    if (typeof schema === "boolean") {
      return schema;
    }

    const { additionalDefinitions, mode, maxRefDepth } = options;
    const definitions = mergeDefinitions(schema, additionalDefinitions);

    const getDefaultValue = () => {
      if (mode === "type-default") {
        return getEnumValueOrDefault(schema as NonBooleanJSONSchema<Extension>);
      } else if (mode === "null") {
        return null;
      }
      return undefined;
    };

    if (schema.default !== undefined) {
      return schema.default;
    } else if (schema.type === "object") {
      if (!schema.properties) {
        return getDefaultValue();
      }

      const val = Object.keys(schema.properties).reduce(
        (acc, key) => {
          const val = inner(
            schema.properties![key],
            options,
            refDepth,
            parentRefs,
          );

          if (val !== undefined) {
            acc[key] = val;
          }

          return acc;
        },
        {} as Record<string, AnySchemaValue>,
      );

      if (Object.keys(val).length === 0) {
        return getDefaultValue();
      }

      return val;
    } else if (schema.type === "array") {
      if (!schema.items) {
        return getDefaultValue();
      }

      const count = schema.minItems ?? 0;
      if (Array.isArray(schema.items)) {
        const defaultValues = schema.items.map((item) =>
          inner(item, options, refDepth, parentRefs),
        );
        const items = [];
        for (let i = 0; i < count; i++) {
          items.push(defaultValues[i % defaultValues.length]);
        }
      } else {
        const defaultValue = inner(schema.items, options, refDepth, parentRefs);
        return Array(count).fill(defaultValue);
      }
    } else if (schema.$ref) {
      if (maxRefDepth !== undefined && refDepth > maxRefDepth) {
        return null;
      }
      if (parentRefs.has(schema.$ref)) {
        return null;
      }

      const newParentRefs = new Set(parentRefs);
      newParentRefs.add(schema.$ref);

      const refSchema = getLocalRef(schema.$ref, definitions);
      return inner(refSchema, options, refDepth + 1, newParentRefs);
    } else if (schema.allOf) {
      const merged = mergeAllOfs(schema, definitions);
      return inner(merged, options, refDepth, parentRefs);
    }

    if (mode === "type-default") {
      return getEnumValueOrDefault(schema as NonBooleanJSONSchema<Extension>);
    } else if (mode === "null") {
      return null;
    }

    return undefined;
  }

  return inner(schema, options) ?? null;
}

/**
 * Get the default value from a type
 * @param schema - The schema to get the default value from
 */
function getDefaultValueFromSchema<Extension extends {}>(
  schema: NonBooleanJSONSchema<Extension>,
): AnySchemaValue {
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
}

/**
 * Get the default value from a type or first enum value
 * @param schema - The schema to get the default value from
 */
function getEnumValueOrDefault<Extension extends {}>(
  schema: NonBooleanJSONSchema<Extension>,
): AnySchemaValue {
  if (schema.enum?.length && typeof schema.enum[0] === "string") {
    return schema.enum[0];
  }
  return getDefaultValueFromSchema(schema);
}
