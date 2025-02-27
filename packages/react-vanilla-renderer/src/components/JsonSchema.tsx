import React from "react";
import { FormJsonSchema } from "@phalleux/jsf-core";
import { EyeIcon } from "lucide-react";

import { Field } from "./fields";
import { TooltipWrapper } from "./shared";

export type BaseFieldProps = {
  path: string;
  schema: Exclude<FormJsonSchema, boolean>;
};

type FieldMatcher = {
  match: (schema: FormJsonSchema) => boolean;
  component: React.ComponentType<BaseFieldProps>;
};

const withTooltip = (Component: React.ComponentType<BaseFieldProps>) => {
  if (!import.meta.env.DEV) {
    return Component;
  }

  const Comp = (props: BaseFieldProps) => {
    return (
      <div className="relative">
        <div className="absolute top-0 right-0">
          <TooltipWrapper title={JSON.stringify(props.schema, null, 2)}>
            <button className="text-neutral-500 cursor-pointer">
              <EyeIcon size={16} />
            </button>
          </TooltipWrapper>
        </div>
        <Component {...props} />
      </div>
    );
  };
  Comp.displayName = `withTooltip(${Component.displayName || Component.name})`;

  return Comp;
};

const Fields: FieldMatcher[] = [
  {
    match: (schema) => schema.allOf !== undefined,
    component: Field.AllOf,
  },
  {
    match: (schema) => schema.type === "string",
    component: withTooltip(Field.String),
  },
];

export function JsonSchema({ path, schema }: BaseFieldProps) {
  const { type } = schema;
  if (Array.isArray(type)) {
    return <Field.Unknown type={type} />;
  }

  if (typeof type === "undefined") {
    return <Field.Unknown type="undefined" />;
  }

  const FieldComponent = Fields.find((field) => field.match(schema))?.component;
  if (FieldComponent) {
    return <FieldComponent schema={schema} path={path} />;
  }

  return <Field.Unknown type={type} />;
}
