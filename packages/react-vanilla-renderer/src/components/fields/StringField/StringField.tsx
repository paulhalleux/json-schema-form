import { useMemo } from "react";

import { BaseFieldProps } from "../../JsonSchema.tsx";

import { BaseStringField } from "./BaseStringField.tsx";
import { formats, getStringFieldFormat } from "./formats";

export function StringField({ schema, path }: BaseFieldProps) {
  const format = useMemo(() => getStringFieldFormat(formats, schema), [schema]);

  const formatProps = useMemo(() => {
    if (!format) {
      return {};
    }

    return typeof format.props === "function"
      ? format.props(schema)
      : format.props;
  }, [format, schema]);

  if (!format) {
    return (
      <BaseStringField
        path={path}
        schema={schema}
        min={schema.minLength}
        max={schema.maxLength}
        regex={schema.pattern}
      />
    );
  }

  return <format.component path={path} schema={schema} {...formatProps} />;
}
