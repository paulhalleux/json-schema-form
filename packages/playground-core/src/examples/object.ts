import { SchemaExampleCategory } from "../types/examples.ts";

export const ObjectExamples: SchemaExampleCategory = {
  id: "object",
  title: "Object",
  children: [
    {
      id: "object",
      title: "Default",
      schema: {
        type: "object",
        title: "Object",
        description: "A simple object",
        properties: {
          name: {
            type: "string",
            title: "Name",
            description: "A simple string",
          },
          age: {
            type: "number",
            title: "Age",
            description: "A simple number",
          },
        },
      },
    },
    {
      id: "object-required",
      title: "Required",
      schema: {
        type: "object",
        title: "Object",
        description: "A simple object",
        required: ["name"],
        properties: {
          name: {
            type: "string",
            title: "Name",
            description: "A simple string",
          },
          age: {
            type: "number",
            title: "Age",
            description: "A simple number",
          },
        },
      },
    },
    {
      id: "object-all-of",
      title: "All Of",
      schema: {
        type: "object",
        title: "Object",
        description: "A simple object",
        allOf: [
          {
            required: ["name"],
            properties: {
              name: {
                type: "string",
                title: "Name",
                description: "A simple string",
              },
            },
          },
          {
            properties: {
              age: {
                type: "number",
                title: "Age",
                description: "A simple number",
              },
            },
          },
        ],
      },
    },
    {
      id: "object-ref",
      title: "Ref",
      schema: {
        definitions: {
          person: {
            type: "object",
            required: ["name"],
            properties: {
              name: {
                type: "string",
                title: "Name",
                description: "A simple string",
              },
            },
          },
        },
        type: "object",
        title: "Object",
        description: "A simple object",
        $ref: "#/definitions/person",
      },
    },
  ],
};
