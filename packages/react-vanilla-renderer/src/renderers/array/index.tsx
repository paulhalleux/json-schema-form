import { type SchemaRenderer } from "@phalleux/jsf-core";
import { Tester } from "@phalleux/jsf-schema-utils";

import { ArrayRenderer } from "./ArrayRenderer.tsx";

const defaultArrayRenderer: SchemaRenderer = {
  id: "react-vanilla.array.default",
  tester: Tester((builder) => {
    builder.withType("array");
  }),
  priority: 11,
  renderer: ArrayRenderer,
};

export const arrayRenderers = [defaultArrayRenderer];
