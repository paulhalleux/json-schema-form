import { useCallback, useMemo } from "react";
import { resolveUiSchemaValues } from "@phalleux/jsf-core/src";
import { AnySchemaValue } from "@phalleux/jsf-schema-utils/src";

import { BaseFieldProps } from "../components";
import { useFormInstance, useStore } from "../index.tsx";

export function useField<T extends AnySchemaValue>({
  path,
  schema,
}: BaseFieldProps) {
  const instance = useFormInstance();

  const value = useStore((_, form) => form.getFieldValue(path) as T | null);
  const errors = useStore((_, form) => form.getFieldErrors(path));

  const setValue = useCallback(
    (value: ((prev: T | null) => T) | T) => {
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

  const ui = useMemo(() => resolveUiSchemaValues(schema), [schema]);

  return {
    value,
    setValue,
    ui,
    id: path === "" ? "#" : path,
    error: errors[0]?.message,
  };
}
