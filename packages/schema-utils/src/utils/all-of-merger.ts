import { merge, omit } from "lodash";

import { BaseJsonSchema } from "../types/schema.ts";

import { isBooleanStartSchema } from "./testers.ts";

/**
 * {@link AllOfMerger}
 * ---
 * This helper is used to merge a schema with allOf into a single schema.
 */
export const AllOfMerger = {
  /**
   * Merge a schema with allOf into a single schema.
   * The resulting schema will have the common properties of the original schema and all the allOf properties.
   * @param schema The schema to merge
   */
  merge<Ext extends {}>(schema: BaseJsonSchema<Ext>): BaseJsonSchema<Ext> {
    if (isBooleanStartSchema(schema)) {
      return schema;
    }

    if (!schema.allOf) {
      return schema;
    }

    const schemaWithoutAllOf = omit(schema, ["allOf"]);

    return schema.allOf.reduce((mergedSchema, allOfSchema) => {
      if (isBooleanStartSchema(allOfSchema)) {
        return mergedSchema;
      }
      return merge({}, mergedSchema, allOfSchema);
    }, schemaWithoutAllOf as BaseJsonSchema);
  },
};
