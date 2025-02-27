import { AllOfMerger, BaseJsonSchema } from "../../src";

describe("allOfMerger", () => {
  it("should merge schemas with only allOf", () => {
    const schema: BaseJsonSchema = {
      allOf: [
        { type: "object", properties: { a: { type: "string" } } },
        { type: "object", properties: { b: { type: "number" } } },
      ],
    };

    const result = AllOfMerger.merge(schema);
    expect(result).toEqual({
      type: "object",
      properties: {
        a: { type: "string" },
        b: { type: "number" },
      },
    });
  });
  it("schema with only refs should override", () => {
    const schema: BaseJsonSchema = {
      definitions: {
        a: { type: "string" },
        b: { type: "number" },
      },
      allOf: [{ $ref: "#/definitions/a" }, { $ref: "#/definitions/b" }],
    };

    const result = AllOfMerger.merge(schema);
    expect(result).toEqual({
      definitions: {
        a: { type: "string" },
        b: { type: "number" },
      },
      $ref: "#/definitions/b",
    });
  });
  it("should merge schema with allOf and other properties", () => {
    const schema: BaseJsonSchema = {
      type: "object",
      properties: { c: { type: "boolean" } },
      allOf: [
        { type: "object", properties: { a: { type: "string" } } },
        { type: "object", properties: { b: { type: "number" } } },
      ],
    };

    const result = AllOfMerger.merge(schema);
    expect(result).toEqual({
      type: "object",
      properties: {
        c: { type: "boolean" },
        a: { type: "string" },
        b: { type: "number" },
      },
    });
  });
});
