import React from "react";

import type { AnySchemaValue } from "@phalleux/jsf-schema-utils";
import { SchemaDefault } from "@phalleux/jsf-schema-utils/src";

import { useStore } from "../adapter";

import { type UseFieldArgs } from "./useField.ts";
import { useKeyedArray } from "./useKeyedArray.ts";
import { useMappedMemo } from "./useMappedMemo.ts";
import { useSetValue } from "./useSetValue.ts";

/**
 * Helper hook to manage array fields.
 * @param args - The field arguments.
 * @returns The array field value, error and helper functions.
 */
export function useArrayField<T extends AnySchemaValue>({
  path,
  schema,
}: Pick<UseFieldArgs, "path" | "schema">) {
  const { setValue } = useSetValue<T[]>({ path });

  const items = useStore((_, form) => {
    const value = form.getFieldValue(path);
    return Array.isArray(value) ? value : [];
  });

  const [keyedItems, { push: _push, remove: _remove, reorder: _reorder }] =
    useKeyedArray<T>(items, [schema]);

  const arrayItems = useMappedMemo(
    keyedItems,
    (item) => item.key,
    (item, index) => {
      return {
        key: item.key,
        value: item.item,
        path: `${path}[${index}]`,
        schema: Array.isArray(schema.items)
          ? schema.items[index % schema.items.length]
          : schema.items,
      };
    },
    [path, schema.items],
  );

  const push = React.useCallback(() => {
    const addedKey = _push();

    setValue((value) => {
      const nextSchema = Array.isArray(schema.items)
        ? schema.items[(value?.length ?? 0) % schema.items.length]
        : schema.items;

      const defaultItem = (
        nextSchema ? (SchemaDefault.get(nextSchema) ?? null) : null
      ) as T;

      return [...(value ?? []), defaultItem];
    });

    return addedKey;
  }, [_push, schema.items, setValue]);

  const remove = React.useCallback(
    (index: number) => {
      _remove(index);
      setValue((value) => {
        if (value) {
          const copy = [...value];
          copy.splice(index, 1);
          return copy;
        }
        return value ?? [];
      });
    },
    [_remove, setValue],
  );

  const reorder = React.useCallback(
    (fromIndex: number, toIndex: number) => {
      _reorder(fromIndex, toIndex);
      setValue((value) => {
        if (value) {
          const copy = [...value];
          const [removed] = copy.splice(fromIndex, 1);
          if (!removed) return value;
          copy.splice(toIndex, 0, removed);
          return copy;
        }
        return value ?? [];
      });
    },
    [_reorder, setValue],
  );

  return {
    value: arrayItems,
    push,
    remove,
    reorder,
  };
}
