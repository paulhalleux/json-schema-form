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
        },
        if: {
          properties: {
            name: {
              const: "John",
            },
          },
        },
        then: {
          properties: {
            age: {
              type: "number",
              minimum: 18,
            },
          },
        },
        else: {
          properties: {
            age: {
              type: "number",
              minimum: 21,
            },
          },
        },
      },
    },
    {
      id: "condition-all-of",
      title: "AllOf",
      schema: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          age: {
            type: "number",
          },
        },
        allOf: [
          {
            if: {
              properties: {
                name: {
                  const: "John",
                },
              },
            },
            then: {
              properties: {
                age: {
                  type: "number",
                  minimum: 18,
                },
              },
            },
            else: {
              properties: {
                age: {
                  type: "number",
                  minimum: 21,
                },
              },
            },
          },
        ],
      },
    },
  ],
};
