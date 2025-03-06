import { useCallback } from "react";

import type { AnySchemaValue } from "@phalleux/jsf-core";

import { useFormInstance } from "../adapter";

import type { UseFieldArgs } from "./useField.ts";

export function useSetValue<T extends AnySchemaValue>({
  path = "",
}: UseFieldArgs) {
  const instance = useFormInstance();

  const setValue = useCallback(
    (value: ((prev: T | null) => T) | T | null) => {
      if (typeof value === "function") {
        const currentValue = instance.getFieldValue(path) as T | null;
        instance.setFieldValue(path, value(currentValue));
      } else {
        instance.setFieldValue(path, value);
      }
    },
    [instance, path],
  );

  return { setValue };
}
