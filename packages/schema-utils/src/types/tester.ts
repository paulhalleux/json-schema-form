import type { ObjectSchema } from "./schema";

/**
 * A function that tests if a schema and return true if it is supported
 * @param schema - The schema to test
 * @returns True if the schema is supported
 */
export type SchemaTester = (schema: ObjectSchema) => boolean;
