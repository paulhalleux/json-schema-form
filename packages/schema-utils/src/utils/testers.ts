import { BaseJsonSchema, NonBooleanBaseJsonSchema } from "../types/schema.ts";
import { SchemaTester } from "../types/tester.ts";

export const isBooleanStartSchema = (
  schema: BaseJsonSchema,
): schema is boolean => {
  return schema === true || schema === false;
};

/**
 * TCreate a tester for a non-boolean schema
 * @param tester The tester to apply
 */
export const nonBooleanTester =
  (tester: (schema: NonBooleanBaseJsonSchema) => boolean): SchemaTester =>
  (schema) => {
    return !isBooleanStartSchema(schema) && tester(schema);
  };

/**
 * Create a tester for a specific type
 * @param type The type to test
 */
export const typeTester = (type: string | string[]): SchemaTester =>
  nonBooleanTester((schema) => {
    if (Array.isArray(type)) {
      return type.includes(schema.type);
    }
    return schema.type === type;
  });

/**
 * Test if a schema is an enum schema
 */
const isEnumSchema: SchemaTester = nonBooleanTester((schema) => {
  return Array.isArray(schema.enum);
});

/**
 * Test if a schema is a const schema
 */
const isConstSchema: SchemaTester = nonBooleanTester((schema) => {
  return schema.const !== undefined;
});

/**
 * Test if a schema is a oneOf schema
 */
const isOneOfSchema: SchemaTester = nonBooleanTester((schema) => {
  return Array.isArray(schema.oneOf);
});

/**
 * Test if a schema is an allOf schema
 */
const isAllOfSchema: SchemaTester = nonBooleanTester((schema) => {
  return Array.isArray(schema.allOf);
});

/**
 * Test if a schema is an anyOf schema
 */
const isAnyOfSchema: SchemaTester = nonBooleanTester((schema) => {
  return Array.isArray(schema.anyOf);
});

/**
 * Test if a schema is a ref schema
 */
const isRefSchema: SchemaTester = nonBooleanTester((schema) => {
  return typeof schema.$ref === "string";
});

/**
 * Test if a schema is a not schema
 */
const isNotSchema: SchemaTester = nonBooleanTester((schema) => {
  return schema.not !== undefined;
});

/**
 * Test if a schema is a string format schema
 */
const isStringFormatSchema: (format: string) => SchemaTester = (format) =>
  nonBooleanTester((schema) => {
    return typeof schema.format === "string" && schema.format === format;
  });

/**
 * Set of functions to test a schema
 */
export const Tester = {
  // type testers
  isBooleanSchema: typeTester("boolean"),
  isStringSchema: typeTester("string"),
  isNumberSchema: typeTester("number"),
  isArraySchema: typeTester("array"),
  isObjectSchema: typeTester("object"),
  isNullSchema: typeTester("null"),
  isIntegerSchema: typeTester("integer"),
  isNumericSchema: typeTester(["number", "integer"]),

  // specific schema testers
  isEnumSchema,
  isConstSchema,
  isOneOfSchema,
  isAllOfSchema,
  isAnyOfSchema,
  isRefSchema,
  isNotSchema,
  isStringFormatSchema,

  // tester factories
  nonBooleanTester,
  typeTester,
};
