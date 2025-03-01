import { formatNames } from "ajv-formats/dist/formats";

import type { SchemaExampleCategory } from "../types/examples.ts";

export const NumberExamples: SchemaExampleCategory = {
  id: "number",
  title: "Number",
  children: [
    {
      id: "number",
      title: "Number",
      schema: {
        type: "number",
        title: "Number",
        description: "A number",
      },
    },
    {
      id: "integer",
      title: "Integer",
      schema: {
        type: "integer",
        title: "Integer",
        description: "An integer",
      },
    },
    {
      id: "number-min-max",
      title: "Min/Max",
      schema: {
        type: "number",
        title: "Number",
        description: "A number",
        minimum: 0,
        maximum: 10,
      },
    },
    {
      id: "number-exclusive-min-max",
      title: "Exclusive Min/Max",
      schema: {
        type: "number",
        title: "Number",
        description: "A number",
        exclusiveMinimum: 0,
        exclusiveMaximum: 10,
      },
    },
    {
      id: "number-multiple-of",
      title: "Multiple Of",
      schema: {
        type: "number",
        title: "Number",
        description: "A number",
        multipleOf: 2,
      },
    },
    {
      id: "number-formats",
      title: "Formats",
      children: formatNames
        .filter((format) =>
          ["int32", "int64", "double", "float"].includes(format),
        )
        .map((format) => ({
          id: `number-formats-${format}`,
          title: format,
          schema: {
            type: "number",
            title: format,
            description: `A ${format} number`,
            format,
          },
        })),
    },
  ],
};
