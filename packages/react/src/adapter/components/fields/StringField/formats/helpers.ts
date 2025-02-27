import React from "react";
import { JSONSchema } from "@phalleux/jsf-core";

import { BaseFieldProps } from "../../../JsonSchema.tsx";

export type StringFieldFormat<Props extends BaseFieldProps> = {
  match: (schema: JSONSchema) => boolean;
  component: React.ComponentType<Props>;
  props:
    | Omit<Props, keyof BaseFieldProps>
    | ((schema: JSONSchema) => Omit<Props, keyof BaseFieldProps>);
};

/**
 * Define the formats for the string field.
 * @param format
 */
export const createFormat = <Props extends BaseFieldProps>(
  format: StringFieldFormat<Props>,
) => format;

/**
 * Get the string field format that matches the schema.
 */
export function getStringFieldFormat<Props extends BaseFieldProps>(
  formats: StringFieldFormat<any>[],
  schema: JSONSchema,
): StringFieldFormat<Props> | undefined {
  return formats.find((format) => format.match(schema));
}
