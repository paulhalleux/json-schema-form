import type { AnySchemaValue } from "@phalleux/jsf-core";
import { Schema } from "@phalleux/jsf-schema-utils";

import { useStore } from "../adapter";

import { useSetValue } from "./useSetValue.ts";

export type UseFieldArgs = {
  schema: Schema;
  path: string;
};

/**
 * Helper hook to manage field.
 * @param args - The field arguments.
 * @returns The field value, error and helper functions.
 */
export function useField<T extends AnySchemaValue>({
  schema,
  path,
}: UseFieldArgs) {
  const { setValue } = useSetValue({ schema, path });
  const value = useStore((_, form) => form.getFieldValue(path) as T | null);

  return {
    value,
    setValue,
    id: schema.getPath(),
    error: undefined,
    required: false,
  };
}
