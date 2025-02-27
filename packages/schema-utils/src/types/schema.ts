export type JsonSchemaType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "object"
  | "array"
  | "null";

export type BaseJsonSchema<Extension extends {} = any> =
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
      $defs?: Record<string, BaseJsonSchema<Extension>>;

      /**
       * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1
       */
      type?: JsonSchemaType | JsonSchemaType[];
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
      items?: BaseJsonSchema<Extension> | BaseJsonSchema<Extension>[];
      additionalItems?: BaseJsonSchema<Extension>;
      contains?: BaseJsonSchema<Extension>;
      maxItems?: number;
      minItems?: number;
      uniqueItems?: boolean;

      /**
       * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.5
       */
      maxProperties?: number;
      minProperties?: number;
      required?: string[];
      properties?: Record<string, BaseJsonSchema<Extension>>;
      patternProperties?: Record<string, BaseJsonSchema<Extension>>;
      additionalProperties?: BaseJsonSchema<Extension>;
      unevaluatedProperties?: BaseJsonSchema<Extension>;
      dependencies?: Record<string, BaseJsonSchema<Extension> | string[]>;
      propertyNames?: BaseJsonSchema<Extension>;

      /**
       * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.6
       */
      if?: BaseJsonSchema<Extension>;
      then?: BaseJsonSchema<Extension>;
      else?: BaseJsonSchema<Extension>;

      /**
       * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.7
       */
      allOf?: BaseJsonSchema<Extension>[];
      anyOf?: BaseJsonSchema<Extension>[];
      oneOf?: BaseJsonSchema<Extension>[];
      not?: BaseJsonSchema<Extension>;

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
      definitions?: Record<string, BaseJsonSchema<Extension>>;

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

export type NonBooleanBaseJsonSchema<Extension extends {} = any> = Exclude<
  BaseJsonSchema<Extension>,
  boolean
>;

export type AnySchemaValue =
  | string
  | number
  | boolean
  | Record<string, any>
  | any[]
  | null;
