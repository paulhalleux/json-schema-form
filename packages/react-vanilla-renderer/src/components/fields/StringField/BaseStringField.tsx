import React, { useCallback, useMemo } from "react";

import { useField } from "../../../hooks/useField.ts";
import { BaseFieldProps } from "../../JsonSchema.tsx";
import { Field, Input } from "../../shared";

export type BaseStringFieldProps = BaseFieldProps & {
  type?: string;
  regex?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  transform?: {
    fromValue: (value: string) => string;
    toValue: (value: string) => string;
  };
};

export function BaseStringField({
  schema,
  path,
  transform,
  ...fieldProps
}: BaseStringFieldProps) {
  const { regex, min, max, type, step } = fieldProps;
  const { value, setValue, id, error } = useField<string>({
    schema,
    path,
  });

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = transform
        ? transform.fromValue(e.target.value)
        : e.target.value;
      setValue(value);
    },
    [setValue, transform],
  );

  const transformedValue = useMemo(() => {
    if (!value) {
      return "";
    }
    return transform ? transform.toValue(value) : value;
  }, [transform, value]);

  return (
    <Field id={id} label={schema.title} help={schema.$comment} error={error}>
      <Input
        type={type}
        name={id}
        id={id}
        value={transformedValue}
        onChange={onInputChange}
        placeholder={schema.description}
        pattern={regex}
        min={min}
        max={max}
        minLength={typeof min === "number" ? min : undefined}
        maxLength={typeof max === "number" ? max : undefined}
        error={!!error}
        step={step}
      />
    </Field>
  );
}
