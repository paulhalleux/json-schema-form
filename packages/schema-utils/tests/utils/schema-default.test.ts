import { RefResolver } from "json-schema-ref-resolver";

import type { BaseJsonSchema } from "../../src";
import { SchemaDefault, SchemaDefaultMode } from "../../src";

describe("default", () => {
  describe("object", () => {
    it("should return default values for schema", () => {
      const schema: BaseJsonSchema = {
        type: "object",
        properties: {
          foo: {
            type: "string",
            default: "bar",
          },
          baz: {
            type: "number",
            default: 42,
          },
          qux: {
            type: "array",
            items: {
              type: "string",
            },
            default: ["foo", "bar"],
          },
        },
      };

      const defaults = SchemaDefault.get(schema);

      expect(defaults).toEqual({
        foo: "bar",
        baz: 42,
        qux: ["foo", "bar"],
      });
    });
    it("should return default values for schema with no properties", () => {
      const schema: BaseJsonSchema = {
        type: "object",
      };

      expect(SchemaDefault.get(schema)).toEqual(undefined);
      expect(
        SchemaDefault.get(schema, { mode: SchemaDefaultMode.Null }),
      ).toEqual(null);
      expect(
        SchemaDefault.get(schema, { mode: SchemaDefaultMode.TypeDefault }),
      ).toEqual({});
    });
    it("should return default values for schema with references", () => {
      const schema: BaseJsonSchema = {
        $id: "root",
        type: "object",
        properties: {
          foo: {
            $ref: "#/definitions/foo",
          },
        },
      };

      const refSchema: BaseJsonSchema = {
        $id: "#/definitions/foo",
        type: "string",
        default: "bar",
      };

      const refResolver = new RefResolver();

      refResolver.addSchema(schema, schema.$id);
      refResolver.addSchema(refSchema, refSchema.$id);

      const defaults = SchemaDefault.get(schema, { refResolver });

      expect(defaults).toEqual({
        foo: "bar",
      });
    });
    it("should return default values for schema with references (circular)", () => {
      const schema: BaseJsonSchema = {
        $id: "root",
        type: "object",
        properties: {
          a: {
            $ref: "#/definitions/foo",
          },
          b: {
            type: "object",
            default: {
              qux: "qux",
            },
          },
        },
      };

      const refSchema: BaseJsonSchema = {
        $id: "#/definitions/foo",
        type: "object",
        properties: {
          c: {
            $ref: "root",
          },
        },
      };

      const refResolver = new RefResolver();

      refResolver.addSchema(schema, schema.$id);
      refResolver.addSchema(refSchema, refSchema.$id);

      expect(SchemaDefault.get(schema, { refResolver })).toEqual({
        b: {
          qux: "qux",
        },
      });
      expect(
        SchemaDefault.get(schema, {
          mode: SchemaDefaultMode.Null,
          refResolver,
        }),
      ).toEqual({
        a: {
          c: {
            a: null,
            b: {
              qux: "qux",
            },
          },
        },
        b: {
          qux: "qux",
        },
      });
    });
  });
  describe("array", () => {
    it("should get the default of an array with no restrictions", () => {
      const schema: BaseJsonSchema = {
        type: "array",
        items: {
          type: "string",
          default: "foo",
        },
      };

      const defaults = SchemaDefault.get(schema);

      expect(defaults).toEqual([]);
    });
    it("should get the default of an array with min items", () => {
      const schema: BaseJsonSchema = {
        type: "array",
        minItems: 2,
        items: {
          type: "string",
          default: "foo",
        },
      };

      const defaults = SchemaDefault.get(schema);

      expect(defaults).toEqual(["foo", "foo"]);
    });
    it("should get the default of an array with min items (null)", () => {
      const schema: BaseJsonSchema = {
        type: "array",
        minItems: 2,
        items: {
          type: "string",
        },
      };

      expect(
        SchemaDefault.get(schema, { mode: SchemaDefaultMode.SchemaDefault }),
      ).toEqual([]);
      expect(
        SchemaDefault.get(schema, { mode: SchemaDefaultMode.Null }),
      ).toEqual([null, null]);
    });
    it("should get the default of an array with min items (undefined)", () => {
      const schema: BaseJsonSchema = {
        type: "array",
        minItems: 2,
        items: {
          type: "string",
        },
        default: ["foo", "bar"],
      };

      expect(
        SchemaDefault.get(schema, { mode: SchemaDefaultMode.SchemaDefault }),
      ).toEqual(["foo", "bar"]);
    });
    it("should get the default of an array with references", () => {
      const schema: BaseJsonSchema = {
        $id: "root",
        type: "array",
        minItems: 2,
        items: {
          $ref: "#/definitions/foo",
        },
      };

      const refSchema: BaseJsonSchema = {
        $id: "#/definitions/foo",
        type: "string",
        default: "bar",
      };

      const refResolver = new RefResolver();

      refResolver.addSchema(schema, schema.$id);
      refResolver.addSchema(refSchema, refSchema.$id);

      const defaults = SchemaDefault.get(schema, { refResolver });

      expect(defaults).toEqual(["bar", "bar"]);
    });
  });
  describe("string", () => {
    it("should return the default value for a string", () => {
      const schema: BaseJsonSchema = {
        type: "string",
        default: "foo",
      };

      expect(SchemaDefault.get(schema)).toEqual("foo");
    });
    it("should return the default value for a string (null)", () => {
      const schema: BaseJsonSchema = {
        type: "string",
      };

      expect(SchemaDefault.get(schema)).toEqual(undefined);
      expect(
        SchemaDefault.get(schema, {
          mode: SchemaDefaultMode.TypeDefault,
        }),
      ).toEqual("");
      expect(
        SchemaDefault.get(schema, { mode: SchemaDefaultMode.Null }),
      ).toEqual(null);
    });
  });
  describe("number", () => {
    it("should return the default value for a number", () => {
      const schema: BaseJsonSchema = {
        type: "number",
        default: 42,
      };

      expect(SchemaDefault.get(schema)).toEqual(42);
    });
    it("should return the default value for a number (null)", () => {
      const schema: BaseJsonSchema = {
        type: "number",
      };

      expect(SchemaDefault.get(schema)).toEqual(undefined);
      expect(
        SchemaDefault.get(schema, {
          mode: SchemaDefaultMode.TypeDefault,
        }),
      ).toEqual(0);
      expect(
        SchemaDefault.get(schema, { mode: SchemaDefaultMode.Null }),
      ).toEqual(null);
    });
  });
  describe("integer", () => {
    it("should return the default value for an integer", () => {
      const schema: BaseJsonSchema = {
        type: "integer",
        default: 42,
      };

      expect(SchemaDefault.get(schema)).toEqual(42);
    });
    it("should return the default value for an integer (null)", () => {
      const schema: BaseJsonSchema = {
        type: "integer",
      };

      expect(SchemaDefault.get(schema)).toEqual(undefined);
      expect(
        SchemaDefault.get(schema, {
          mode: SchemaDefaultMode.TypeDefault,
        }),
      ).toEqual(0);
      expect(
        SchemaDefault.get(schema, { mode: SchemaDefaultMode.Null }),
      ).toEqual(null);
    });
  });
  describe("boolean", () => {
    it("should return the default value for a boolean", () => {
      const schema: BaseJsonSchema = {
        type: "boolean",
        default: true,
      };

      expect(SchemaDefault.get(schema)).toEqual(true);
    });
    it("should return the default value for a boolean (null)", () => {
      const schema: BaseJsonSchema = {
        type: "boolean",
      };

      expect(SchemaDefault.get(schema)).toEqual(undefined);
      expect(
        SchemaDefault.get(schema, {
          mode: SchemaDefaultMode.TypeDefault,
        }),
      ).toEqual(false);
      expect(
        SchemaDefault.get(schema, { mode: SchemaDefaultMode.Null }),
      ).toEqual(null);
    });
  });
  describe("null", () => {
    it("should return the default value for null", () => {
      const schema: BaseJsonSchema = {
        type: "null",
      };

      expect(
        SchemaDefault.get(schema, { mode: SchemaDefaultMode.TypeDefault }),
      ).toEqual(null);
    });
    it("should return the default value for null (null)", () => {
      const schema: BaseJsonSchema = {
        type: "null",
      };

      expect(
        SchemaDefault.get(schema, {
          mode: SchemaDefaultMode.TypeDefault,
        }),
      ).toEqual(null);
      expect(
        SchemaDefault.get(schema, { mode: SchemaDefaultMode.Null }),
      ).toEqual(null);
    });
  });
  describe("enum", () => {
    it("should return the default value for an enum", () => {
      const schema: BaseJsonSchema = {
        enum: ["foo", "bar"],
        default: "foo",
      };

      expect(SchemaDefault.get(schema)).toEqual("foo");
    });
    it("should return the default value for an enum (null)", () => {
      const schema: BaseJsonSchema = {
        enum: ["foo", "bar"],
      };

      expect(
        SchemaDefault.get(schema, { mode: SchemaDefaultMode.Null }),
      ).toEqual(null);
    });
    it("should return the default value for an enum (undefined)", () => {
      const schema: BaseJsonSchema = {
        enum: ["foo", "bar"],
      };

      expect(
        SchemaDefault.get(schema, { mode: SchemaDefaultMode.TypeDefault }),
      ).toEqual("foo");
    });
  });
  describe("oneOf", () => {
    it("should return the default value for oneOf", () => {
      const schema: BaseJsonSchema = {
        oneOf: [
          {
            type: "string",
            default: "foo",
          },
          {
            type: "number",
            default: 42,
          },
        ],
      };

      expect(SchemaDefault.get(schema)).toEqual(42);
    });
    it("should return the default value for oneOf (null)", () => {
      const schema: BaseJsonSchema = {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "number",
          },
        ],
      };

      expect(
        SchemaDefault.get(schema, { mode: SchemaDefaultMode.Null }),
      ).toEqual(null);
    });
    it("should return the default value for oneOf (undefined)", () => {
      const schema: BaseJsonSchema = {
        oneOf: [
          {
            type: "string",
            default: "foo",
          },
          {
            type: "number",
            default: 42,
          },
        ],
      };

      expect(SchemaDefault.get(schema)).toEqual(42);
    });
    it("should return the default value for oneOf with object", () => {
      const schema: BaseJsonSchema = {
        oneOf: [
          {
            type: "object",
            properties: {
              foo: {
                type: "string",
                default: "bar",
              },
            },
          },
          {
            type: "object",
            properties: {
              baz: {
                type: "number",
                default: 42,
              },
            },
          },
        ],
      };

      expect(SchemaDefault.get(schema)).toEqual({
        baz: 42,
        foo: "bar",
      });
    });
  });
  describe("allOf", () => {
    it("should return the default value for allOf", () => {
      const schema: BaseJsonSchema = {
        allOf: [
          {
            type: "object",
            properties: {
              foo: {
                type: "string",
                default: "bar",
              },
            },
          },
          {
            type: "object",
            properties: {
              baz: {
                type: "number",
                default: 42,
              },
            },
          },
        ],
      };

      expect(SchemaDefault.get(schema)).toEqual({
        baz: 42,
        foo: "bar",
      });
    });
    it("should return the default value for allOf (null)", () => {
      const schema: BaseJsonSchema = {
        allOf: [
          {
            type: "object",
            properties: {
              foo: {
                type: "string",
              },
            },
          },
          {
            type: "object",
            properties: {
              baz: {
                type: "number",
              },
            },
          },
        ],
      };

      expect(
        SchemaDefault.get(schema, { mode: SchemaDefaultMode.Null }),
      ).toEqual({
        baz: null,
        foo: null,
      });
    });
    it("should return the default value for allOf (undefined)", () => {
      const schema: BaseJsonSchema = {
        allOf: [
          {
            type: "object",
            properties: {
              foo: {
                type: "string",
                default: "bar",
              },
            },
          },
          {
            type: "object",
            properties: {
              baz: {
                type: "number",
                default: 42,
              },
            },
          },
        ],
      };

      expect(SchemaDefault.get(schema)).toEqual({
        baz: 42,
        foo: "bar",
      });
    });
  });
});
