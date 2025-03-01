import { useMemo } from "react";

import type { FormJsonSchema } from "@phalleux/jsf-core";
import type { AnySchemaValue } from "@phalleux/jsf-schema-utils";

import { useFormInstance, useStore } from "../adapter";

import { useSetValue } from "./useSetValue.ts";

export type UseFieldArgs = {
  path: string;
  schema: FormJsonSchema;
  parentSchema?: FormJsonSchema;
};

/**
 * Helper hook to manage field.
 * @param args - The field arguments.
 * @returns The field value, error and helper functions.
 */
export function useField<T extends AnySchemaValue>({
  path,
  parentSchema,
}: UseFieldArgs) {
  const instance = useFormInstance();

  const value = useStore((_, form) => form.getFieldValue(path) as T | null);
  const errors = useStore((_, form) => form.getFieldErrors(path));
  const required = useMemo(() => {
    return instance.isRequired(path, parentSchema);
  }, [instance, parentSchema, path]);

  const { setValue } = useSetValue({ path });

  return {
    value,
    setValue,
    id: path === "" ? "#" : path,
    error: errors[0]?.message,
    required,
  };
}
