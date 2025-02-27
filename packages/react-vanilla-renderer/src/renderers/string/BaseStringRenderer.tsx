import React, { useCallback } from "react";
import { BaseRendererProps } from "@phalleux/jsf-core";

import { Field, Input } from "../../components/shared";
import { useField } from "../../hooks/useField";

export type BaseStringFieldProps = BaseRendererProps & {
  type?: string;
  regex?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
};

export function BaseStringRenderer({
  schema,
  path,
  ...fieldProps
}: BaseStringFieldProps) {
  const { regex, min, max, type, step } = fieldProps;
  const { value, setValue, id, error } = useField<string>({
    schema,
    path,
  });

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setValue(value);
    },
    [setValue],
  );

  return (
    <Field id={id} label={schema.title} help={schema.$comment} error={error}>
      <Input
        type={type}
        name={id}
        id={id}
        value={value ?? ""}
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
