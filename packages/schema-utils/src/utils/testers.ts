import { BaseJsonSchema } from "../types/schema.ts";
import { SchemaTester } from "../types/tester.ts";

/**
 * Test if the schema is a boolean schema
 * @param schema The schema to test
 * @returns True if the schema is a boolean schema
 */
export const isBooleanStartSchema = (
  schema: BaseJsonSchema,
): schema is boolean => {
  return schema === true || schema === false;
};

/**
 * Builder for a schema tester
 */
export class TesterBuilder {
  private testers: SchemaTester[] = [];

  /**
   * Add a tester to the builder
   * @param tester The tester to add
   */
  public add(tester: SchemaTester): this {
    this.testers.push(tester);
    return this;
  }

  /**
   * Add a tester that checks if the schema is a boolean schema
   */
  public withType(type: string): this {
    return this.add((schema) => schema.type === type);
  }

  /**
   * Add a tester that checks if the schema is a boolean schema
   * @param format
   */
  public withFormat(format: string): this {
    return this.add((schema) => schema.format === format);
  }

  /**
   * Build the schema tester
   */
  public build(): SchemaTester {
    return (schema) => {
      return this.testers.some((tester) => tester(schema));
    };
  }
}

/**
 * Create a schema tester
 * @param init The tester builder initialization
 */
export function Tester(init: (builder: TesterBuilder) => void): SchemaTester {
  const builder = new TesterBuilder();
  init(builder);
  return builder.build();
}
