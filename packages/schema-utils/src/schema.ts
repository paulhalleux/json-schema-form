import Ajv, { type ValidateFunction } from "ajv";
import { clone, merge } from "lodash";

import type { JsonSchema, ObjectSchema } from "./types";

export class Schema<T extends JsonSchema = JsonSchema> {
  private schema: T;
  private readonly path: string;

  private readonly root: Schema;
  private readonly parent: Schema | undefined;

  private readonly ajv: Ajv;
  private validator: ValidateFunction | undefined;

  /**
   * A map of sub-schemas.
   * @example
   * const schema = new Schema({ type: "object", properties: { foo: { type: "string" } } });
   * const fooSchema = schema.getSubSchema("#/properties/foo");
   */
  private readonly subSchemaMap: Map<string, Schema> = new Map();

  /**
   * A map of definitions.
   * Contains all definitions from the schema object and optionally user-defined definitions.
   */
  private readonly definitions: Map<string, JsonSchema> = new Map();

  constructor(definition: T, parent?: Schema, path?: string) {
    this.root = parent ? parent.root : this;
    this.parent = parent;
    this.path = path || "#";

    this.schema = definition;
    this.definitions = this.generateDefinitions();

    // Construct the validator by adding all definitions to the Ajv instance.
    this.ajv = new Ajv({ formats: {}, strict: false });
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let s: Schema | undefined = this;
    while (s) {
      s.definitions.forEach((definition, key) => {
        this.ajv.addSchema(definition, key);
      });
      s = s.parent;
    }
  }

  /**
   * Returns the root schema object.
   * @returns {Schema} The root schema object.
   */
  getRoot() {
    return this.root;
  }

  /**
   * Returns the path of the schema object.
   * @returns {string} The path of the schema object.
   */
  getPath() {
    return this.path;
  }

  /**
   * Returns the parent schema object.
   * @returns {Schema | undefined} The parent schema object
   */
  getParent() {
    return this.parent;
  }

  /**
   * Returns a sub-schema object.
   * @param {string} ref - The JSON pointer reference.
   * @returns {Schema} The sub-schema object.
   */
  getSubSchema(ref: string) {
    return this.subSchemaMap.get(ref) || this.createSubSchema(ref);
  }

  /**
   * Returns the JSON schema object.
   * @returns {JsonSchema} The JSON schema object.
   */
  toJSON() {
    return this.schema;
  }

  /**
   * Validates the data against the schema.
   * @param {unknown} data - The data to validate.
   * @returns {boolean} `true` if the data is valid, otherwise `false`.
   */
  validate(data: unknown): boolean {
    if (!this.validator) {
      this.validator = this.ajv.compile(this.schema);
    }
    this.validator(data);
    return !this.validator.errors?.length;
  }

  /**
   * Returns the dereferenced JSON schema object.
   * Will resolve top-level $ref properties and optionally $refs contained in the resolved schema.
   * Will not resolve nested $refs in properties and items.
   * @returns {JsonSchema} The dereferenced JSON schema object.
   */
  toDereferencedJSON() {
    const _dereference = (schema: JsonSchema): JsonSchema => {
      if (typeof schema === "boolean" || !schema.$ref) {
        return schema;
      }

      const referencedSchema = this.getDefinition(schema.$ref);
      if (!referencedSchema) {
        return schema;
      }

      delete schema.$ref;
      return merge(schema, _dereference(referencedSchema));
    };
    return _dereference(clone(this.schema));
  }

  /**
   * Returns a new schema object with a dereferenced JSON schema.
   * Will resolve top-level $ref properties and optionally $refs contained in the resolved schema..
   * Will not resolve nested $refs in properties and items.
   * @returns {Schema} The new schema object.
   */
  toDereferenced() {
    return this.cloneWith(this.toDereferencedJSON());
  }

  /**
   * Will merge allOf properties in the schema object.
   * Will resolve top-level $ref properties.
   * If allOf properties have an `if` and `then` property, it will apply the condition.
   * @returns {JsonSchema} The merged JSON schema object.
   */
  toResolvedJSON(value: unknown): JsonSchema {
    const _merge = (schema: JsonSchema): JsonSchema => {
      if (typeof schema === "boolean" || !schema.allOf) {
        return schema;
      }

      const parts = [];
      for (let i = 0; i < schema.allOf.length; i++) {
        const subSchema = this.getSubSchema(`#/allOf/${i}`);
        const conditionSchema = subSchema?.applyConditionFor(value);
        if (conditionSchema) {
          const dereferencedSchema = conditionSchema.toDereferencedJSON();
          if (typeof dereferencedSchema === "boolean") {
            continue;
          }
          parts.push(dereferencedSchema);
        }
      }

      delete schema.allOf;
      return _merge(merge(schema, ...parts));
    };

    return _merge(clone(this.schema)) as T;
  }

  toResolved(value: unknown): Schema {
    return this.cloneWith(this.toResolvedJSON(value));
  }

  /**
   * Registers a definition.
   * @param {string} name - The definition name.
   * @param {JsonSchema} definition - The definition object.
   */
  registerDefinition(definition: JsonSchema, name?: string) {
    if (typeof definition === "boolean") {
      if (!name)
        throw new Error("Cannot register a boolean schema without a name");
      else this.definitions.set(name, definition);
      return;
    }

    const identifier = name || definition.$id;
    if (!identifier) {
      throw new Error(
        "Cannot register a definition without an identifier, either provide a name or a $id",
      );
    }

    this.definitions.set(identifier, definition);
  }

  /**
   * Returns a definition object.
   * First seeks the definition in the local definitions map and then in the parent schema.
   * @param {string} name - The definition name.
   * @returns {JsonSchema | undefined} The definition object.
   */
  getDefinition(name: string): JsonSchema | undefined {
    const localDefinition = this.definitions.get(name);
    if (localDefinition !== undefined) {
      return localDefinition;
    }

    return this.parent ? this.parent.getDefinition(name) : undefined;
  }

  /**
   * Dereferences the JSON schema object.
   * This method mutates the current schema object.
   * It will first look for a definition in the root schema object.
   * @note This method is recursive and dereference directly nested $ref, direct-circular references are not supported.
   * @private
   */
  dereference() {
    this.schema = this.toDereferencedJSON() as T;
  }

  /**
   * Applies the condition for the schema object with the given value.
   * If the schema object has an `if` and `then` property, it will apply the condition.
   * If the condition is true, it will return the `then` schema, otherwise the `else` schema.
   * If the condition is false and there is no `else` schema, it will return the schema object without the condition properties.
   * @param value - The value to apply the condition.
   */
  applyConditionFor(value: unknown) {
    const _applyCondition = (schema: JsonSchema): Schema => {
      if (typeof schema === "boolean" || !schema.if || !schema.then) {
        return this;
      }

      const ifSchema = this.getSubSchema("#/if");
      const thenSchema = this.getSubSchema("#/then");
      const elseSchema = this.getSubSchema("#/else");

      delete schema.if;
      delete schema.then;
      delete schema.else;

      if (!ifSchema || !thenSchema) {
        return this.cloneWith(schema);
      }

      const valid = ifSchema.validate(value);
      const finalSchema = valid ? thenSchema : elseSchema;

      if (!finalSchema) {
        return this.cloneWith(schema);
      }

      return this.cloneWith(merge(schema, finalSchema.toJSON()));
    };

    return _applyCondition(clone(this.schema));
  }

  /**
   * Clones the schema object with the given schema.
   * It will keep the parent and path of the current schema object.
   * @param schema - The schema object to clone.
   */
  cloneWith(schema: JsonSchema): Schema {
    return new Schema(schema, this.parent, this.path);
  }

  /**
   * Returns a sub-schema object.
   * If the sub-schema object does not exist, it will create a new schema object.
   * If the sub-schema object is a boolean, it will return the current schema object.
   * If the sub-schema is not found, it will return `undefined`.
   * @param {string} ref - The JSON pointer reference.
   * @returns {Schema} The sub-schema object.
   */
  private createSubSchema(ref: string) {
    const subSchema = this.resolveReference(ref);
    if (!subSchema) {
      return undefined;
    }

    this.subSchemaMap.set(ref, subSchema);
    return subSchema;
  }

  /**
   * Resolves a JSON pointer reference.
   * const schema = new Schema({ foo: { bar: { baz: "qux" } } });
   * @param {string} ref - The JSON pointer reference.
   * @returns {JsonSchema} The JSON schema object.
   */
  private resolveReference(ref: string): Schema | undefined {
    if (typeof this.schema === "boolean") {
      return undefined;
    }

    const [, schemaProperty, propertyName] = ref.split("/");
    if (!schemaProperty) {
      return undefined;
    }

    let subSchema = this.schema[schemaProperty as keyof ObjectSchema];
    let path = `${this.path}/${schemaProperty}`;

    if (propertyName) {
      path = `${path}/${propertyName}`;
      subSchema = subSchema[propertyName];
    }

    if (!subSchema) {
      return undefined;
    }

    return new Schema(subSchema, this, path);
  }

  /**
   * Generates a map of definitions based on the schema object.
   * @private
   */
  private generateDefinitions() {
    const definitions = new Map<string, JsonSchema>();
    if (typeof this.schema === "boolean") {
      return definitions;
    }

    if (this.schema.definitions) {
      for (const [name, definition] of Object.entries(
        this.schema.definitions,
      )) {
        definitions.set(`#/definitions/${name}`, definition);
      }
    }

    if (this.schema.$defs) {
      for (const [name, definition] of Object.entries(this.schema.$defs)) {
        definitions.set(`#/$defs/${name}`, definition);
      }
    }

    return definitions;
  }

  /**
   * Returns the schema object as an object schema.
   */
  public asObjectSchema(): Schema<ObjectSchema> {
    return this as Schema<ObjectSchema>;
  }

  /**
   * Returns the schema object as a boolean schema.
   */
  public asBooleanSchema(): Schema<boolean> {
    return this as Schema<boolean>;
  }

  /**
   * Checks if the schema object is an object schema.
   */
  public isObjectSchema(): this is Schema<ObjectSchema> {
    return typeof this.schema === "object";
  }

  /**
   * Checks if the schema object is a boolean schema.
   */
  public isBooleanSchema(): this is Schema<boolean> {
    return typeof this.schema === "boolean";
  }

  /**
   * Get the leaf path of the schema object.
   * @example
   * Path: #/properties/foo
   * Leaf path: foo
   */
  public getLeafPath(): string {
    return this.path.split("/").pop() || "";
  }

  public isRequired(value: unknown): boolean {
    const parent = this.parent;
    if (!parent?.isObjectSchema()) {
      return false;
    }

    const propertyKey = this.getLeafPath();
    const directRequired =
      parent.schema.required?.includes(propertyKey) ?? false;
    if (directRequired) {
      return true;
    }

    if (
      !parent.schema.dependentRequired ||
      value === null ||
      value === undefined ||
      typeof value !== "object"
    ) {
      return false;
    }

    for (const [field, requiredIfFieldPresent] of Object.entries(
      parent.schema.dependentRequired,
    )) {
      if (
        field === propertyKey &&
        requiredIfFieldPresent.every(
          (field) => field in value && !!value[field as keyof typeof value],
        )
      ) {
        return true;
      }
    }

    return false;
  }
}
