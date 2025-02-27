export type JSONSchemaType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "object"
  | "array"
  | "null";

export type JSONSchema<Extension extends {} = {}> =
  | boolean
  | (Extension & {
      $id?: string;
      $ref?: string;
      $schema?: string;
      $comment?: string;

      /**
       * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-00#section-8.2.4
       * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#appendix-A
       */
      $defs?: Record<string, JSONSchema<Extension>>;

      /**
       * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1
       */
      type?: JSONSchemaType | JSONSchemaType[];
      const?: unknown;
      enum?: unknown[];

      /**
       * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.2
       */
      multipleOf?: number;
      maximum?: number;
      exclusiveMaximum?: number;
      minimum?: number;
      exclusiveMinimum?: number;

      /**
       * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.3
       */
      maxLength?: number;
      minLength?: number;
      pattern?: string;

      /**
       * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.4
       */
      items?: JSONSchema<Extension> | JSONSchema<Extension>[];
      additionalItems?: JSONSchema<Extension>;
      contains?: JSONSchema<Extension>;
      maxItems?: number;
      minItems?: number;
      uniqueItems?: boolean;

      /**
       * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.5
       */
      maxProperties?: number;
      minProperties?: number;
      required?: string[];
      properties?: Record<string, JSONSchema<Extension>>;
      patternProperties?: Record<string, JSONSchema<Extension>>;
      additionalProperties?: JSONSchema<Extension>;
      unevaluatedProperties?: JSONSchema<Extension>;
      dependencies?: Record<string, JSONSchema<Extension> | string[]>;
      propertyNames?: JSONSchema<Extension>;

      /**
       * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.6
       */
      if?: JSONSchema<Extension>;
      then?: JSONSchema<Extension>;
      else?: JSONSchema<Extension>;

      /**
       * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.7
       */
      allOf?: JSONSchema<Extension>[];
      anyOf?: JSONSchema<Extension>[];
      oneOf?: JSONSchema<Extension>[];
      not?: JSONSchema<Extension>;

      /**
       * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-7
       */
      format?: string;

      /**
       * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-8
       */
      contentMediaType?: string;
      contentEncoding?: string;

      /**
       * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-9
       */
      definitions?: Record<string, JSONSchema<Extension>>;

      /**
       * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-10
       */
      title?: string;
      description?: string;
      default?: unknown;
      readOnly?: boolean;
      writeOnly?: boolean;
      examples?: unknown[];
    });

export type NonBooleanJSONSchema<Extension extends {} = {}> = Exclude<
  JSONSchema<Extension>,
  boolean
>;

export type AnySchemaValue =
  | string
  | number
  | boolean
  | Record<string, any>
  | any[]
  | null;
