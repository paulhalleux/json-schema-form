import type {
  Format,
  ObjectSchema,
  SchemaTester,
  SchemaTesterFn,
} from "../types";

function withType(type: string): SchemaTesterFn {
  return (schema) => schema.type === type;
}

function withAnyTypeOf(...types: ObjectSchema["type"][]): SchemaTesterFn {
  return (schema) => types.includes(schema.type);
}

function withStringFormat(format: Format): SchemaTesterFn {
  return (schema) => schema.format === format;
}

function keyword(name: keyof ObjectSchema): SchemaTesterFn {
  return (schema) =>
    typeof schema === "object" &&
    Object.prototype.hasOwnProperty.call(schema, name);
}

export const test = {
  keyword,
  withType,
  withAnyTypeOf,
  withStringFormat,
  object: withType("object"),
  array: withType("array"),
  string: withType("string"),
  number: withType("number"),
  integer: withType("integer"),
  boolean: withType("boolean"),
  null: withType("null"),
  or:
    (...testers: SchemaTesterFn[]): SchemaTesterFn =>
    (schema) =>
      testers.some((tester) => tester(schema)),
  and:
    (...testers: SchemaTesterFn[]): SchemaTesterFn =>
    (schema) =>
      testers.every((tester) => tester(schema)),
};

export function createTester(
  priority: number,
  tester: SchemaTesterFn,
): SchemaTester {
  Object.assign(tester, { priority });
  return tester as SchemaTester;
}
