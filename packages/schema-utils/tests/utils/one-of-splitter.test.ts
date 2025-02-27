import { BaseJsonSchema, OneOfSplitter } from "../../src";

describe("oneOfSplitter", () => {
  it("should split schema with only oneOf", () => {
    const schema: BaseJsonSchema = {
      oneOf: [
        { type: "object", properties: { a: { type: "string" } } },
        { type: "object", properties: { b: { type: "number" } } },
      ],
    };

    const result = OneOfSplitter.split(schema);
    expect(result).toEqual([
      { type: "object", properties: { a: { type: "string" } } },
      { type: "object", properties: { b: { type: "number" } } },
    ]);
  });
  it("should split schema with oneOf and definitions", () => {
    const schema: BaseJsonSchema = {
      definitions: {
        a: { type: "string" },
        b: { type: "number" },
      },
      oneOf: [{ $ref: "#/definitions/a" }, { $ref: "#/definitions/b" }],
    };

    const result = OneOfSplitter.split(schema);
    expect(result).toEqual([
      {
        definitions: {
          a: { type: "string" },
          b: { type: "number" },
        },
        $ref: "#/definitions/a",
      },
      {
        definitions: {
          a: { type: "string" },
          b: { type: "number" },
        },
        $ref: "#/definitions/b",
      },
    ]);
  });
  it("should split schema with oneOf and other properties", () => {
    const schema: BaseJsonSchema = {
      type: "object",
      properties: { c: { type: "boolean" } },
      oneOf: [
        { type: "object", properties: { a: { type: "string" } } },
        { type: "object", properties: { b: { type: "number" } } },
      ],
    };

    const result = OneOfSplitter.split(schema);
    expect(result).toEqual([
      {
        type: "object",
        properties: { c: { type: "boolean" }, a: { type: "string" } },
      },
      {
        type: "object",
        properties: { c: { type: "boolean" }, b: { type: "number" } },
      },
    ]);
  });
  it("should split schema with oneOf and other properties and definitions", () => {
    const schema: BaseJsonSchema = {
      type: "object",
      properties: { c: { type: "boolean" } },
      definitions: {
        a: { type: "string" },
        b: { type: "number" },
      },
      oneOf: [{ $ref: "#/definitions/a" }, { $ref: "#/definitions/b" }],
    };

    const result = OneOfSplitter.split(schema);
    expect(result).toEqual([
      {
        definitions: {
          a: { type: "string" },
          b: { type: "number" },
        },
        type: "object",
        properties: { c: { type: "boolean" } },
        $ref: "#/definitions/a",
      },
      {
        definitions: {
          a: { type: "string" },
          b: { type: "number" },
        },
        type: "object",
        properties: { c: { type: "boolean" } },
        $ref: "#/definitions/b",
      },
    ]);
  });
});
