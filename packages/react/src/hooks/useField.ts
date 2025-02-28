import { useCallback } from "react";
import { AnySchemaValue } from "@phalleux/jsf-schema-utils";

import { useFormInstance, useStore } from "../adapter";

type UseFieldArgs = {
  path: string;
};

export function useField<T extends AnySchemaValue>({ path }: UseFieldArgs) {
  const instance = useFormInstance();

  const value = useStore((_, form) => form.getFieldValue(path) as T | null);
  const errors = useStore((_, form) => form.getFieldErrors(path));

  const setValue = useCallback(
    (value: ((prev: T | null) => T) | T | null) => {
      if (typeof value === "function") {
        const currentValue = instance.getFieldValue(path) as T | null;
        instance.setFieldValue(path, value(currentValue));
      } else {
        instance.setFieldValue(path, value);
      }
      instance.validate();
    },
    [instance, path],
  );

  return {
    value,
    setValue,
    id: path === "" ? "#" : path,
    error: errors[0]?.message,
  };
}
