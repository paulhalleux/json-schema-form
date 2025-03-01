import { useState } from "react";

import { createForm } from "@phalleux/jsf-core";

import { Playground } from "../containers";
import type { SchemaExampleCategory } from "../types/examples.ts";

const examples: SchemaExampleCategory[] = Array.from(
  { length: 10 },
  (_, i) => ({
    id: `category-${i}`,
    title: `Category ${i}`,
    children: Array.from({ length: 10 }, (_, j) => ({
      id: `example-${i}-${j}`,
      title: `Example ${i}-${j}`,
      schema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            title: `Name ${i}`,
          },
          age: {
            type: "number",
            title: `Age ${j}`,
          },
        },
      },
    })),
  }),
);

export function App() {
  const [form] = useState(() => createForm());
  return (
    <Playground examples={examples} form={form} name={"Playground"}>
      Form renderer goes here
    </Playground>
  );
}
