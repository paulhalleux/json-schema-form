import type { SchemaExampleCategory } from "../types/examples.ts";

export const ConditionExamples: SchemaExampleCategory = {
  id: "condition",
  title: "Condition",
  children: [
    {
      id: "condition-simple",
      title: "Simple",
      schema: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          age: {
            type: "number",
          },
          isAdult: {
            if: {
              properties: {
                age: {
                  type: "number",
                  minimum: 18,
                },
              },
            },
            then: {
              title: "Adult",
              type: "string",
            },
            else: {
              title: "Minor",
              type: "string",
            },
          },
        },
      },
    },
  ],
};
