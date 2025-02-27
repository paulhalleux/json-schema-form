import { describe } from "vitest";

import { AnySchemaValue, getSchemaDefaultValue, JSONSchema } from "../../src";

describe("default", () => {
  describe("simple", () => {
    describe("mode: type-default", () => {
      it.each<[JSONSchema, AnySchemaValue]>([
        [{ type: "boolean" }, false],
        [{ type: "object" }, {}],
        [{ type: "array" }, []],
        [{ type: "null" }, null],
        [{ type: "integer" }, 0],
        [{ type: "number" }, 0],
        [{ type: "string" }, ""],
        [{ type: "string", enum: ["a", "b"] }, "a"],
        [{ type: "string", enum: [] }, ""],
      ])(
        "should get default value for simple schema: %s -> %s",
        (schema, result) => {
          expect(
            getSchemaDefaultValue(schema, { mode: "type-default" }),
          ).toEqual(result);
        },
      );
    });
    describe("mode: null", () => {
      it.each<[JSONSchema, AnySchemaValue]>([
        [{ type: "boolean" }, null],
        [{ type: "object" }, null],
        [{ type: "array" }, null],
        [{ type: "null" }, null],
        [{ type: "integer" }, null],
        [{ type: "number" }, null],
        [{ type: "string" }, null],
        [{ type: "string", enum: ["a", "b"] }, null],
        [{ type: "string", enum: [] }, null],
      ])(
        "should get default value for simple schema: %s -> %s",
        (schema, result) => {
          expect(getSchemaDefaultValue(schema, { mode: "null" })).toEqual(
            result,
          );
        },
      );
    });
    describe("mode: schema-default", () => {
      it.each<[JSONSchema, AnySchemaValue]>([
        [{ type: "boolean", default: true }, true],
        [{ type: "object", default: { a: 1 } }, { a: 1 }],
        [{ type: "array", default: [1] }, [1]],
        [{ type: "null", default: null }, null],
        [{ type: "integer", default: 1 }, 1],
        [{ type: "number", default: 1.1 }, 1.1],
        [{ type: "string", default: "a" }, "a"],
        [{ type: "string", enum: ["a", "b"], default: "b" }, "b"],
        [{ type: "string", enum: [], default: "a" }, "a"],
      ])(
        "should get default value for simple schema: %s -> %s",
        (schema, result) => {
          expect(
            getSchemaDefaultValue(schema, { mode: "schema-default" }),
          ).toEqual(result);
        },
      );
    });
  });
  describe("array", () => {
    describe("mode: type-default", () => {
      it.each<[JSONSchema, AnySchemaValue]>([
        [{ type: "array", minItems: 1, items: { type: "boolean" } }, [false]],
        [{ type: "array", minItems: 1, items: { type: "object" } }, [{}]],
        [{ type: "array", minItems: 1, items: { type: "array" } }, [[]]],
        [{ type: "array", minItems: 1, items: { type: "null" } }, [null]],
        [{ type: "array", minItems: 1, items: { type: "integer" } }, [0]],
        [{ type: "array", minItems: 1, items: { type: "number" } }, [0]],
        [{ type: "array", minItems: 1, items: { type: "string" } }, [""]],
        [
          {
            type: "array",
            minItems: 1,
            items: { type: "string", enum: ["a", "b"] },
          },
          ["a"],
        ],
        [
          { type: "array", minItems: 1, items: { type: "string", enum: [] } },
          [""],
        ],
      ])(
        "should get default value for simple schema: %s -> %s",
        (schema, result) => {
          expect(
            getSchemaDefaultValue(schema, { mode: "type-default" }),
          ).toEqual(result);
        },
      );
    });
    describe("mode: null", () => {
      it.each<[JSONSchema, AnySchemaValue]>([
        [{ type: "array", minItems: 1, items: { type: "boolean" } }, [null]],
        [{ type: "array", minItems: 1, items: { type: "object" } }, [null]],
        [{ type: "array", minItems: 1, items: { type: "array" } }, [null]],
        [{ type: "array", minItems: 1, items: { type: "null" } }, [null]],
        [{ type: "array", minItems: 1, items: { type: "integer" } }, [null]],
        [{ type: "array", minItems: 1, items: { type: "number" } }, [null]],
        [{ type: "array", minItems: 1, items: { type: "string" } }, [null]],
        [
          {
            type: "array",
            minItems: 1,
            items: { type: "string", enum: ["a", "b"] },
          },
          [null],
        ],
        [
          { type: "array", minItems: 1, items: { type: "string", enum: [] } },
          [null],
        ],
      ])(
        "should get default value for simple schema: %s -> %s",
        (schema, result) => {
          expect(getSchemaDefaultValue(schema, { mode: "null" })).toEqual(
            result,
          );
        },
      );
    });
    describe("mode: schema-default", () => {
      it.each<[JSONSchema, AnySchemaValue]>([
        [
          {
            type: "array",
            minItems: 1,
            items: { type: "boolean" },
            default: [true],
          },
          [true],
        ],
        [
          {
            type: "array",
            minItems: 1,
            items: { type: "object" },
            default: [{ a: 1 }],
          },
          [{ a: 1 }],
        ],
        [
          {
            type: "array",
            minItems: 1,
            items: { type: "array" },
            default: [[1]],
          },
          [[1]],
        ],
        [
          {
            type: "array",
            minItems: 1,
            items: { type: "null" },
            default: [null],
          },
          [null],
        ],
        [
          {
            type: "array",
            minItems: 1,
            items: { type: "integer" },
            default: [1],
          },
          [1],
        ],
        [
          {
            type: "array",
            minItems: 1,
            items: { type: "number" },
            default: [1.1],
          },
          [1.1],
        ],
        [
          {
            type: "array",
            minItems: 1,
            items: { type: "string" },
            default: ["a"],
          },
          ["a"],
        ],
        [
          {
            type: "array",
            minItems: 1,
            items: { type: "string", enum: ["a", "b"] },
            default: ["b"],
          },
          ["b"],
        ],
        [
          {
            type: "array",
            minItems: 1,
            items: { type: "string", enum: [] },
            default: ["a"],
          },
          ["a"],
        ],
        [
          {
            type: "array",
            minItems: 1,
            items: { type: "string", enum: ["a", "b"], default: "b" },
          },
          ["b"],
        ],
        [
          {
            type: "array",
            minItems: 1,
            items: { type: "string", enum: [], default: "a" },
          },
          ["a"],
        ],
        [
          {
            type: "array",
            minItems: 3,
            items: { type: "string", enum: [], default: "a" },
          },
          ["a", "a", "a"],
        ],
      ])(
        "should get default value for simple schema: %s -> %s",
        (schema, result) => {
          expect(
            getSchemaDefaultValue(schema, { mode: "schema-default" }),
          ).toEqual(result);
        },
      );
    });
  });
  describe("allOf", () => {
    it.each<[JSONSchema, AnySchemaValue]>([
      [
        {
          allOf: [{ type: "string" }, { enum: ["a", "b"] }, { default: "b" }],
        },
        "b",
      ],
      [
        {
          allOf: [{ type: "string" }, { enum: ["a", "b"] }, { default: "c" }],
        },
        "c",
      ],
    ])(
      "should get default value for allOf schema: %s -> %s",
      (schema, result) => {
        expect(getSchemaDefaultValue(schema)).toEqual(result);
      },
    );
    it.each<[JSONSchema, AnySchemaValue]>([
      [
        {
          allOf: [{ type: "string" }, { enum: ["a", "b"] }],
        },
        "a",
      ],
    ])(
      "should get default value for allOf schema: %s -> %s",
      (schema, result) => {
        expect(getSchemaDefaultValue(schema, { mode: "type-default" })).toEqual(
          result,
        );
      },
    );
  });
  describe("ref", () => {
    it.each<[JSONSchema, AnySchemaValue]>([
      [
        {
          $ref: "#/definitions/a",
          definitions: {
            a: { type: "string", default: "a" },
          },
        },
        "a",
      ],
      [
        {
          $ref: "#/definitions/a",
          definitions: {
            a: { type: "string", default: "b" },
          },
        },
        "b",
      ],
    ])(
      "should get default value for ref schema: %s -> %s",
      (schema, result) => {
        expect(getSchemaDefaultValue(schema)).toEqual(result);
      },
    );
  });
  describe("circular ref", () => {
    it.each<[JSONSchema, AnySchemaValue]>([
      [
        {
          $ref: "#/definitions/a",
          definitions: {
            a: { $ref: "#/definitions/b" },
            b: { $ref: "#/definitions/a" },
          },
        },
        null,
      ],
    ])(
      "should get default value for circular ref schema: %s -> %s",
      (schema, result) => {
        expect(getSchemaDefaultValue(schema)).toEqual(result);
      },
    );
  });
  describe("complex", () => {
    it.each<[JSONSchema, AnySchemaValue]>([
      [
        {
          type: "object",
          properties: {
            a: { type: "string", default: "a" },
            b: { type: "string", default: "b" },
          },
        },
        { a: "a", b: "b" },
      ],
      [
        {
          type: "object",
          properties: {
            a: { type: "string", default: "a" },
            b: { type: "string", default: "b" },
          },
          default: { a: "c" },
        },
        { a: "c" },
      ],
    ])(
      "should get default value for complex schema: %s -> %s",
      (schema, result) => {
        expect(getSchemaDefaultValue(schema)).toEqual(result);
      },
    );
  });
});
