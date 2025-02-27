import {
  JSONSchema,
  ResolvedUIValues,
  StringUIValue,
} from "../types/schema.ts";

/**
 * Resolve UI values from schema
 *
 * Some properties can be resolved from the schema itself, like title, description, or comment.
 *
 * @param schema
 */
export function resolveUiSchemaValues(schema: JSONSchema): ResolvedUIValues {
  if (typeof schema !== "object") {
    return {
      label: undefined,
      placeholder: undefined,
      help: undefined,
    };
  }

  const ui = schema.$ui || {};

  const label = resolveString(schema, ui.label, schema.title);
  const placeholder = resolveString(schema, ui.placeholder, schema.description);
  const help = resolveString(schema, ui.help, schema.$comment);

  return {
    ...ui,
    label,
    placeholder,
    help,
  };
}

function resolveString(
  schema: Exclude<JSONSchema, boolean>,
  schemaValue: StringUIValue | undefined,
  defaultValue: string | undefined,
) {
  if (typeof schemaValue === "string") {
    return schemaValue;
  }

  if (schemaValue?.comment) {
    return schema.$comment;
  }

  if (schemaValue?.description) {
    return schema.description;
  }

  if (schemaValue?.title) {
    return schema.title;
  }

  return defaultValue;
}
