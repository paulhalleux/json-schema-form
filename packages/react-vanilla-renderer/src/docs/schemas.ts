import { formatNames } from "ajv-formats/dist/formats";

import { type ExampleListCategory } from "./components/ExampleListCategory.tsx";

const jsonSchemas: ExampleListCategory[] = [
  {
    categoryName: "String",
    schemas: [
      {
        title: "Default",
        description: "A simple string schema",
        $comment: "Some helpful comment",
        type: "string",
      },
      {
        title: "With default value",
        description: "A string schema with default value",
        type: "string",
        default: "Default value",
      },
      {
        title: "Enum",
        description: "A string schema with enum values",
        type: "string",
        enum: ["One", "Two", "Three"],
      },
      {
        title: "AllOf",
        description: "A string schema with allOf",
        type: "string",
        allOf: [{ minLength: 5 }, { maxLength: 10 }],
      },
      {
        categoryName: "String format",
        schemas: formatNames.map((format) => ({
          title: format,
          description: `A string schema with format: ${format}`,
          type: "string",
          format,
        })),
      },
      {
        categoryName: "String constraints",
        schemas: [
          {
            title: "Min length",
            description: "A string schema with minimum length",
            type: "string",
            minLength: 5,
          },
          {
            title: "Max length",
            description: "A string schema with maximum length",
            type: "string",
            maxLength: 10,
          },
          {
            title: "Pattern",
            description: "A string schema with pattern",
            type: "string",
            pattern: "^[A-Za-z]+$",
          },
          {
            title: "Min and max length",
            description: "A string schema with minimum and maximum length",
            type: "string",
            minLength: 5,
            maxLength: 10,
          },
          {
            title: "Date & Time with min and max",
            description: "A string schema with date-time format and min/max",
            type: "string",
            format: "date-time",
            formatMinimum: "2021-01-01T00:00:00",
            formatMaximum: "2022-01-01T00:00:00",
          },
        ],
      },
    ],
  },
  {
    categoryName: "Object",
    schemas: [
      {
        title: "Simple object",
        description: "A simple object schema",
        type: "object",
        properties: {
          name: { type: "string" },
          age: { type: "number" },
        },
      },
      {
        title: "Nested object",
        description: "A nested object schema",
        type: "object",
        properties: {
          name: { type: "string" },
          age: { type: "number" },
          address: {
            type: "object",
            properties: {
              street: { type: "string" },
              city: { type: "string" },
            },
            default: {},
          },
        },
      },
      {
        definitions: {
          address: {
            type: "object",
            properties: {
              street: { type: "string", default: "Default Street" },
              city: { type: "string", default: "Default City" },
            },
          },
        },
        title: "Object with references",
        description: "An object schema with references",
        type: "object",
        properties: {
          name: { type: "string" },
          age: { type: "number" },
          address: { $ref: "#/definitions/address" },
        },
      },
      {
        title: "Object with required",
        description: "An object schema with required fields",
        type: "object",
        properties: {
          name: { type: "string" },
          age: { type: "number" },
        },
        required: ["name"],
      },
      {
        title: "Object with additional properties",
        description: "An object schema with additional properties",
        type: "object",
        additionalProperties: { type: "string" },
      },
    ],
  },
];

export default jsonSchemas;
