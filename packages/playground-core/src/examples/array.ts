import type { SchemaExampleCategory } from "../types/examples.ts";

export const ArrayExamples: SchemaExampleCategory = {
  id: "array",
  title: "Array",
  children: [
    {
      id: "array-default",
      title: "Default",
      schema: {
        type: "array",
        title: "Array",
        description: "This is an array of strings",
        items: {
          type: "string",
        },
      },
    },
    {
      id: "array-object",
      title: "Object",
      schema: {
        type: "array",
        title: "Object Array",
        description: "This is an array of objects",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            age: { type: "number" },
          },
        },
      },
    },
    {
      id: "array-multi-items",
      title: "Multiple Items",
      schema: {
        type: "array",
        title: "Multiple Items",
        description: "This is an array with multiple items",
        items: [{ type: "string" }, { type: "number" }],
      },
    },
  ],
};
