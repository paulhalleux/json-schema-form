import React, { useCallback } from "react";

import type { BaseRendererProps } from "@phalleux/jsf-core";
import { useField } from "@phalleux/jsf-react";

import { Field, Input } from "../../components";

export type BaseNumberRendererProps = BaseRendererProps & {
  min?: number | string;
  max?: number | string;
  step?: number | string;
};

export function BaseNumberRenderer({
  schema,
  path,
  parentSchema,
  ...fieldProps
}: BaseNumberRendererProps) {
  const { min, max, step } = fieldProps;
  const { value, setValue, id, error, required } = useField<number>({
    path,
    parentSchema,
    schema,
  });

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      if (value === "") {
        setValue(null);
      } else {
        if (!isNaN(Number(value))) setValue(Number(value));
        else setValue(null);
      }
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
        type="number"
        name={id}
        id={id}
        value={value ?? ""}
        onChange={onInputChange}
        placeholder={schema.description}
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
