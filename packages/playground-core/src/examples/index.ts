import { ArrayExamples } from "./array.ts";
import { CompleteExamples } from "./complete.ts";
import { ConditionExamples } from "./condition.ts";
import { NumberExamples } from "./number.ts";
import { ObjectExamples } from "./object.ts";
import { StringExamples } from "./string.ts";

export const examples = [
  CompleteExamples,
  {
    id: "types",
    title: "Types",
    children: [
      StringExamples,
      NumberExamples,
      ObjectExamples,
      ArrayExamples,
      ConditionExamples,
    ],
  },
];

export { CompleteSchemas } from "./complete.ts";
