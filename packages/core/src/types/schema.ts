import { JSONSchema as BaseJsonSchema } from "@phalleux/jsf-schema-utils";

export type StringUIValue =
  | {
      description?: boolean;
      title?: boolean;
      comment?: boolean;
    }
  | string;

export type UISchema = {
  label?: StringUIValue;
  placeholder?: StringUIValue;
  help?: StringUIValue;
};

export type ResolvedUIValues = {
  label?: string;
  placeholder?: string;
  help?: string;
};

/**
 * JSON Schema extension for form
 */
export type FormJSONSchemaExtension = {
  $ui?: UISchema;
  formatMinimum?: string | number;
  formatMaximum?: string | number;
  formatExclusiveMinimum?: string | number;
  formatExclusiveMaximum?: string | number;
  formatStep?: string | number;
};

/**
 * JSON Schema for form
 */
export type JSONSchema = Exclude<
  BaseJsonSchema<FormJSONSchemaExtension>,
  boolean
>;
