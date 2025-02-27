import { NonBooleanBaseJsonSchema } from "@phalleux/jsf-schema-utils";

/**
 * Json Schema extension for form
 * ---
 * It add properties required for the render or the validation of a form.
 */
export type FormJsonSchemaExtension = {
  formatMinimum?: string | number;
  formatMaximum?: string | number;
  formatExclusiveMinimum?: string | number;
  formatExclusiveMaximum?: string | number;
  formatStep?: string | number;
};

/**
 * Json Schema for form
 * ---
 * Exclude boolean from the base Json schema as it is not supported by the form and
 * add the form extension properties.
 */
export type FormJsonSchema = NonBooleanBaseJsonSchema<FormJsonSchemaExtension>;
