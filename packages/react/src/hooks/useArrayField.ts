import React from "react";

import type { AnySchemaValue } from "@phalleux/jsf-core";

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
  schema,
  path,
}: UseFieldArgs) {
  const { setValue } = useSetValue<T[]>({ schema, path });

  const _schemaJson = schema.toJSON();
  const schemaJson = typeof _schemaJson === "boolean" ? {} : _schemaJson;

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
        path: `${path ?? ""}[${index}]`,
        schema: Array.isArray(schemaJson.items)
          ? schema.getSubSchema(`#/items/${index % schemaJson.items.length}`)
          : schema.getSubSchema("#/items"),
      };
    },
    [schemaJson],
  );

  const push = React.useCallback(() => {
    const addedKey = _push();

    setValue((value) => {
      // const nextSchema = Array.isArray(schemaJson.items)
      //   ? schema.getSubSchema(
      //       `#/items/${(value?.length ?? 0) % schemaJson.items.length}`,
      //     )
      //   : schema.getSubSchema(`#/items`);

      // const defaultItem = (
      //   nextSchema
      //     ? (SchemaDefault.get(nextSchema, {
      //         refResolver: instance.store.getState().refResolver,
      //         mode: SchemaDefaultMode.TypeDefault,
      //       }) ?? null)
      //     : null
      // ) as T;

      return [...(value ?? []), null as T];
    });

    return addedKey;
  }, [_push, setValue]);

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
          // Forcing non-null value as it can be null or undefined
          copy.splice(toIndex, 0, removed!);
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
