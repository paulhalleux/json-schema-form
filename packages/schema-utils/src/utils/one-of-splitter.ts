import { merge, omit } from "lodash";

import { BaseJsonSchema } from "../types/schema.ts";

import { isBooleanStartSchema } from "./testers.ts";

/**
 * {@link OneOfSplitter}
 * ---
 * This helper is used to split a schema with oneOf into multiple schemas.
 */
export const OneOfSplitter = {
  /**
   * Split a schema with oneOf into multiple schemas.
   * Each resulting schema will have the common properties of the original schema and one of the oneOf properties.
   * @param schema The schema to split
   */
  split<Ext extends {}>(schema: BaseJsonSchema<Ext>): BaseJsonSchema<Ext>[] {
    if (isBooleanStartSchema(schema)) {
      return [schema];
    }

    if (!schema.oneOf) {
      return [schema];
    }

    const schemaWithoutOneOf = omit(schema, ["oneOf"]);

    return schema.oneOf.map((oneOfSchema) => {
      if (isBooleanStartSchema(oneOfSchema)) {
        return oneOfSchema;
      }
      return merge({}, schemaWithoutOneOf, oneOfSchema);
    });
  },
};
