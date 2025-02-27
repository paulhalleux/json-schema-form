import { JSONSchema } from "@phalleux/jsf-core";
import { describe } from "vitest";

import { getLocalRef, mergeAllOfs, splitOneOfs } from "../../src";

describe("resolve", () => {
  describe("mergeAllOfs", () => {
    it("should merge allOfs", () => {
      const schema: JSONSchema = {
        allOf: [
          { type: "object", properties: { a: { type: "string" } } },
          { type: "object", properties: { b: { type: "number" } } },
        ],
      };
      expect(mergeAllOfs(schema)).toEqual({
        type: "object",
        properties: {
          a: { type: "string" },
          b: { type: "number" },
        },
      });
    });
    it("should merge allOfs with references", () => {
      const schema: JSONSchema = {
        allOf: [{ $ref: "#/definitions/a" }, { $ref: "#/definitions/b" }],
        definitions: {
          a: { type: "string" },
          b: { type: "number" },
        },
      };
      expect(mergeAllOfs(schema)).toEqual({ type: "number" });
    });
  });
  describe("splitOneOfs", () => {
    it("should split simple oneOfs", () => {
      const schema: JSONSchema = {
        oneOf: [
          { type: "object", properties: { a: { type: "string" } } },
          { type: "object", properties: { b: { type: "number" } } },
        ],
      };
      expect(splitOneOfs(schema)).toEqual([
        { type: "object", properties: { a: { type: "string" } } },
        { type: "object", properties: { b: { type: "number" } } },
      ]);
    });
    it("should split oneOfs with references", () => {
      const schema: JSONSchema = {
        oneOf: [{ $ref: "#/definitions/a" }, { $ref: "#/definitions/b" }],
        definitions: {
          a: { type: "string" },
          b: { type: "number" },
        },
      };
      expect(splitOneOfs(schema)).toEqual([
        { type: "string" },
        { type: "number" },
      ]);
    });
    it("should split oneOfs with parent properties", () => {
      const schema: JSONSchema = {
        type: "object",
        oneOf: [{ $ref: "#/definitions/a" }, { $ref: "#/definitions/b" }],
        definitions: {
          a: { properties: { a: { type: "string" } } },
          b: { properties: { b: { type: "number" } } },
        },
      };
      expect(splitOneOfs(schema)).toEqual([
        { type: "object", properties: { a: { type: "string" } } },
        { type: "object", properties: { b: { type: "number" } } },
      ]);
    });
  });
  describe("getLocalRef", () => {
    it("should get local ref", () => {
      const schema: JSONSchema = {
        $ref: "#/definitions/a",
        definitions: {
          a: { type: "string" },
        },
      };
      expect(getLocalRef(schema.$ref!, schema.definitions!)).toEqual({
        type: "string",
      });
    });
    it("should get local ref with nested ref", () => {
      const schema: JSONSchema = {
        $ref: "#/definitions/a",
        definitions: {
          a: { $ref: "#/definitions/b" },
          b: { type: "string" },
        },
      };
      expect(getLocalRef(schema.$ref!, schema.definitions!)).toEqual({
        type: "string",
      });
    });
  });
});
