import type { Format } from "./string-formats.ts";

export interface ObjectSchema {
  // Core vocabulary
  $schema?: string;
  $vocabulary?: Record<string, boolean>;
  $id?: string;
  $anchor?: string;
  $dynamicAnchor?: string;
  $ref?: string;
  $dynamicRef?: string;
  $defs?: Record<string, JsonSchema>;
  $comment?: string;

  // Basic meta-data vocabulary
  title?: string;
  description?: string;
  default?: any;
  examples?: any[];
  readOnly?: boolean;
  writeOnly?: boolean;
  deprecated?: boolean;
  definitions?: Record<string, JsonSchema>;

  // Type validation keyword
  type?:
    | "string"
    | "number"
    | "integer"
    | "object"
    | "array"
    | "boolean"
    | "null";

  // String validation keywords
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: Format;
  contentMediaType?: string;
  contentEncoding?: string;
  contentSchema?: JsonSchema | JsonSchema[];

  // Numeric validation keywords
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;

  // Object validation keywords
  required?: string[];
  properties?: Record<string, JsonSchema>;
  patternProperties?: Record<string, JsonSchema>;
  additionalProperties?: JsonSchema;
  propertyNames?: JsonSchema;

  // Array validation keywords
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
  prefixItems?: [JsonSchema, ...JsonSchema[]];
  items?: JsonSchema | [JsonSchema, ...JsonSchema[]];
  contains?: JsonSchema;

  // Conditional schema keywords
  if?: JsonSchema;
  then?: JsonSchema;
  else?: JsonSchema;

  // Combined schema keywords
  allOf?: JsonSchema[];
  anyOf?: JsonSchema[];
  oneOf?: JsonSchema[];
  not?: JsonSchema;

  // Enum schema keywords
  enum?: [any, ...any[]];

  // Const schema keywords
  const?: any;
}

export type BooleanSchema = boolean;
export type JsonSchema = ObjectSchema | BooleanSchema;
