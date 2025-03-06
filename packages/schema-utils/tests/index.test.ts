import { Schema } from "../src";

describe("schema", () => {
  it("should create a schema object", () => {
    const schema = new Schema({ type: "string" });
    expect(schema.toJSON()).toEqual({ type: "string" });
  });

  it("should create a schema object with a reference", () => {
    const schema = new Schema({
      $ref: "#/definitions/foo",
      definitions: { foo: { type: "string" } },
    });
    expect(schema.toDereferencedJSON()).toEqual({ type: "string" });
  });

  it("should create a schema object with a sub-schema", () => {
    const schema = new Schema({
      type: "object",
      properties: { foo: { type: "string" } },
    });
    const fooSchema = schema.getSubSchema("#/properties/foo");
    expect(fooSchema.toJSON()).toEqual({ type: "string" });
  });

  it("should create a schema object with a sub-schema reference", () => {
    const schema = new Schema({
      type: "object",
      properties: { foo: { $ref: "#/definitions/foo" } },
      definitions: { foo: { type: "string" } },
    });
    const fooSchema = schema.getSubSchema("#/properties/foo");
    expect(fooSchema.toDereferencedJSON()).toEqual({ type: "string" });
  });

  it("should create a schema object with additional definitions", () => {
    const schema = new Schema({ $ref: "#/definitions/foo" });
    expect(schema.toJSON()).toEqual({ $ref: "#/definitions/foo" });
    schema.registerDefinition({ type: "number" }, "#/definitions/foo");
    schema.dereference();
    expect(schema.toJSON()).toEqual({ type: "number" });
  });
});
