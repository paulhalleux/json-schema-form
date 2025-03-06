import { formatNames } from "@phalleux/jsf-schema-utils";

import type { SchemaExampleCategory } from "../types/examples.ts";

export const StringExamples: SchemaExampleCategory = {
  id: "string",
  title: "String",
  children: [
    {
      id: "string",
      title: "Default",
      schema: {
        type: "string",
        title: "String",
        description: "A simple string",
        minLength: 5,
        maxLength: 10,
      },
    },
    {
      id: "string-regexp",
      title: "Regexp",
      schema: {
        type: "string",
        title: "String",
        description: "A simple string",
        pattern: "^[a-zA-Z0-9]*$",
      },
    },
    {
      id: "string-all-of",
      title: "All Of",
      schema: {
        type: "string",
        title: "String",
        description: "A simple string",
        allOf: [
          {
            minLength: 5,
          },
          {
            maxLength: 10,
          },
        ],
      },
    },
    {
      id: "string-ref",
      title: "Ref",
      schema: {
        definitions: {
          string: {
            minLength: 5,
            maxLength: 10,
          },
        },
        type: "string",
        title: "String",
        description: "A simple string",
        $ref: "#/definitions/string",
      },
    },
    {
      id: "string-formats",
      title: "Formats",
      children: formatNames
        .filter(
          (format) =>
            ![
              "int32",
              "int64",
              "double",
              "float",
              "date",
              "time",
              "date-time",
            ].includes(format),
        )
        .map((format) => ({
          id: `string-formats-${format}`,
          title: format,
          schema: {
            type: "string",
            title: format,
            description: `A ${format} string`,
            format,
          },
        })),
    },
    {
      id: "string-date",
      title: "Date",
      children: [
        {
          id: "string-date",
          title: "Date",
          schema: {
            type: "string",
            title: "Date",
            description: "A date string",
            format: "date",
          },
        },
        {
          id: "string-date-min-max",
          title: "Date with min and max",
          schema: {
            type: "string",
            title: "Date",
            description: "A date string with min and max",
            format: "date",
            formatMinimum: "2020-01-01",
            formatMaximum: "2021-01-01",
          },
        },
      ],
    },
    {
      id: "string-time",
      title: "Time",
      children: [
        {
          id: "string-time",
          title: "Time",
          schema: {
            type: "string",
            title: "Time",
            description: "A time string",
            format: "time",
          },
        },
        {
          id: "string-time-min-max",
          title: "Time with min and max",
          schema: {
            type: "string",
            title: "Time",
            description: "A time string with min and max",
            format: "time",
            formatMinimum: "00:00:00",
            formatMaximum: "12:00:00",
          },
        },
      ],
    },
    {
      id: "string-date-time",
      title: "Date Time",
      children: [
        {
          id: "string-date-time",
          title: "Date Time",
          schema: {
            type: "string",
            title: "Date Time",
            description: "A date-time string",
            format: "date-time",
          },
        },
        {
          id: "string-date-time-min-max",
          title: "Date Time with min and max",
          schema: {
            type: "string",
            title: "Date Time",
            description: "A date-time string with min and max",
            format: "date-time",
            formatMinimum: "2020-01-01T00:00:00Z",
            formatMaximum: "2021-01-01T12:00:00Z",
          },
        },
      ],
    },
  ],
};
