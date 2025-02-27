import { merge } from "lodash";

import { JSONSchema } from "../types/schema";

type MergeAllOfsOptions = {
  /**
   * Additional definitions to merge
   */
  additionalDefinitions?: Record<string, JSONSchema>;
};

/**
 * Resolve schema with its definitions and allOf
 * @param schema - The schema to merge
 * @param options - The options for merging allOfs
 */
export function mergeAllOfs(
  schema: JSONSchema,
  options: MergeAllOfsOptions = {},
): JSONSchema {
  if (typeof schema === "boolean") {
    return schema;
  }

  const { additionalDefinitions } = options;
  const definitions = mergeDefinitions(schema, additionalDefinitions);
  const {
    allOf = [],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    definitions: _,
    ...rest
  } = {
    ...schema,
  };

  const length = allOf.length;
  let index = -1;
  let result = rest;

  while (++index < length) {
    let item = allOf[index] as any;

    item =
      typeof item.$ref !== "undefined"
        ? getLocalRef(item.$ref, definitions)
        : item;

    result = merge(result, item);
  }

  return result;
}

type SplitAllOfsOptions = {
  /**
   * Additional definitions to merge
   */
  additionalDefinitions?: Record<string, JSONSchema>;
};

/**
 * Split schema with oneOf
 * @param schema - The schema to split
 * @param options - The options for splitting oneOfs
 */
export function splitOneOfs(
  schema: JSONSchema,
  options: SplitAllOfsOptions = {},
): JSONSchema[] {
  if (typeof schema === "boolean") {
    return [schema];
  }

  const { additionalDefinitions } = options;
  const definitions = mergeDefinitions(schema, additionalDefinitions);
  const {
    oneOf = [],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    definitions: _,
    ...rest
  } = {
    ...schema,
  };

  const schemas: JSONSchema[] = [];
  const length = oneOf.length;
  let index = -1;

  while (++index < length) {
    let item = oneOf[index] as any;

    item =
      typeof item.$ref !== "undefined"
        ? getLocalRef(item.$ref, definitions)
        : item;

    schemas.push(merge({}, rest, item));
  }

  return schemas;
}

/**
 * Merge schema definitions with additional definitions
 * @param schema - The schema to merge
 * @param additionalDefinitions - Additional definitions to merge
 */
export function mergeDefinitions(
  schema: JSONSchema,
  additionalDefinitions?: Record<string, JSONSchema>,
): Record<string, JSONSchema> {
  if (typeof schema === "boolean") {
    return {};
  }

  let definitions = schema.definitions || {};
  if (additionalDefinitions) {
    definitions = { ...definitions, ...additionalDefinitions };
  }

  if (schema.$defs) {
    definitions = { ...definitions, ...schema.$defs };
  }

  return definitions;
}

/**
 * Get local reference from definitions
 * @param path - The path to get the reference
 * @param definitions - The definitions to search in
 * @param recursive - Whether to recursively search for references
 */
export const getLocalRef = function (
  path: string,
  definitions: Record<string, JSONSchema>,
  recursive = true,
): JSONSchema {
  const _getLocalRef = (
    path: string,
    definitions: Record<string, JSONSchema>,
    recursive = true,
    parents: Set<string> = new Set(),
  ) => {
    if (parents.has(path)) {
      return {};
    }

    parents.add(path);
    const pathArr = path.replace(/^#\/definitions\//, "").split("/");

    const find = function (
      path: string[],
      root: Record<string, JSONSchema>,
    ): JSONSchema {
      const key = path.shift();
      if (key === undefined || !root[key]) {
        return {};
      } else if (!path.length) {
        const schema = root[key];
        if (typeof schema === "boolean") {
          return schema;
        }

        if (recursive && schema.$ref) {
          return _getLocalRef(schema.$ref, definitions, recursive, parents);
        }

        return schema;
      } else {
        const child = root[key];
        if (typeof child === "boolean") {
          return child;
        }
        return find(path, child.definitions || {});
      }
    };

    return find(pathArr, definitions);
  };

  return _getLocalRef(path, definitions, recursive);
};
