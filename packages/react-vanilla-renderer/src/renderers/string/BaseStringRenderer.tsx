import React, { useCallback } from "react";

import type { BaseRendererProps } from "@phalleux/jsf-core";
import { useField } from "@phalleux/jsf-react";

import { Field, Input } from "../../components";

export type BaseStringRendererProps = BaseRendererProps & {
  type?: string;
  regex?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
};

export function BaseStringRenderer({
  schema,
  path,
  parentSchema,
  ...fieldProps
}: BaseStringRendererProps) {
  const { regex, min, max, type, step } = fieldProps;
  const { value, setValue, id, error, required } = useField<string>({
    path,
    parentSchema,
    schema,
  });

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setValue(value);
    },
    [setValue],
  );

  return (
    <Field
      id={id}
      label={schema.title}
      help={schema.$comment}
      error={error}
      required={required}
    >
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
        required={required}
      />
    </Field>
  );
}
