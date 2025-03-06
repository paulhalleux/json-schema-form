import { merge, omit } from "lodash";

import type { JsonSchema, ObjectSchema } from "./types";

export class Schema<T extends JsonSchema = JsonSchema> {
  private schema: T;
  private readonly path: string;

  private readonly root: Schema;
  private readonly parent: Schema | undefined;

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
   * Returns the dereferenced JSON schema object.
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

      return merge({}, omit(schema, ["$ref"]), _dereference(referencedSchema));
    };
    return _dereference(this.schema);
  }

  /**
   * Returns a new schema object with a dereferenced JSON schema.
   * @returns {Schema} The new schema object.
   */
  toDereferenced() {
    return new Schema<T>(
      this.toDereferencedJSON() as T,
      this.parent,
      this.path,
    );
  }

  /**
   * Returns the merged JSON schema object.
   * @returns {JsonSchema} The merged JSON schema object.
   */
  toMergedJSON(): T {
    const _merge = (schema: JsonSchema): JsonSchema => {
      if (typeof schema === "boolean" || !schema.allOf) {
        return schema;
      }
      return merge(omit(schema, ["allOf"]), ...schema.allOf.map(_merge));
    };
    return _merge(this.schema) as T;
  }

  /**
   * Returns a new schema object with a merged JSON schema.
   * @returns {Schema} The new schema object
   */
  toMerged() {
    return new Schema(this.toMergedJSON(), this.parent, this.path);
  }

  /**
   * Similar to `toDereferencedJSON` but resolves nested $ref in properties and items by getting the sub-schema.
   * This also merges the allOf properties.
   */
  toDeepDereferencedJSON(): JsonSchema {
    const dereferenced = this.toMerged().toDereferenced();
    const clone = merge({}, dereferenced.toJSON());

    if (typeof clone === "boolean") {
      return clone;
    }

    if (clone.properties) {
      for (const [key] of Object.entries(clone.properties)) {
        clone.properties[key] = dereferenced
          .getSubSchema(`#/properties/${key}`)
          .toMerged()
          .toDeepDereferencedJSON();
      }
    }

    if (clone.items) {
      if (Array.isArray(clone.items)) {
        clone.items = clone.items.map((item, index) => {
          return dereferenced
            .getSubSchema(`#/items/${index}`)
            .toMerged()
            .toDeepDereferencedJSON();
        }) as [JsonSchema, ...JsonSchema[]];
      } else {
        clone.items = dereferenced
          .getSubSchema("#/items")
          .toMerged()
          .toDeepDereferencedJSON();
      }
    }

    return this.deepRemoveDefinition(clone);
  }

  private deepRemoveDefinition(schema: JsonSchema) {
    if (typeof schema === "boolean") {
      return schema;
    }

    if (schema.properties) {
      for (const [, value] of Object.entries(schema.properties)) {
        this.deepRemoveDefinition(value);
      }
    }

    if (schema.items) {
      if (Array.isArray(schema.items)) {
        schema.items.forEach((item) => this.deepRemoveDefinition(item));
      } else {
        this.deepRemoveDefinition(schema.items);
      }
    }

    delete schema.definitions;
    delete schema.$defs;
    return schema;
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
   * It will first look for a definition in the root schema object.
   * @note This method is recursive and dereference directly nested $ref, direct-circular references are not supported.
   * @private
   */
  dereference() {
    this.schema = this.toDereferencedJSON() as T;
  }

  /**
   * Returns a sub-schema object.
   * @param {string} ref - The JSON pointer reference.
   * @returns {Schema} The sub-schema object.
   */
  private createSubSchema(ref: string) {
    const subSchema = this.resolveReference(ref);
    this.subSchemaMap.set(ref, subSchema);
    return subSchema;
  }

  /**
   * Resolves a JSON pointer reference.
   * const schema = new Schema({ foo: { bar: { baz: "qux" } } });
   * @param {string} ref - The JSON pointer reference.
   * @returns {JsonSchema} The JSON schema object.
   */
  private resolveReference(ref: string) {
    if (typeof this.schema === "boolean") {
      throw new Error("Cannot resolve reference on a boolean schema");
    }

    const [, schemaProperty, propertyName] = ref.split("/");
    if (!schemaProperty) {
      throw new Error(
        `Invalid JSON pointer reference: ${ref}, expected "#/path/to/property"`,
      );
    }

    let subSchema = this.schema[schemaProperty as keyof ObjectSchema];
    let path = `${this.path}/${schemaProperty}`;

    if (propertyName) {
      path = `${path}/${propertyName}`;
      subSchema = subSchema[propertyName];
    }

    if (!subSchema) {
      throw new Error(`Cannot resolve reference: ${ref}`);
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

  public isObjectSchema(): this is Schema<ObjectSchema> {
    return typeof this.schema === "object";
  }

  public isBooleanSchema(): this is Schema<boolean> {
    return typeof this.schema === "boolean";
  }
}
