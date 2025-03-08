import { type SchemaRenderer } from "@phalleux/jsf-core";
import { createTester, test } from "@phalleux/jsf-schema-utils";

import { ArrayRenderer } from "./ArrayRenderer.tsx";

const arrayTester = createTester(0, test.array);

export const defaultArrayRenderer: SchemaRenderer = {
  id: "react-vanilla.array.default",
  tester: arrayTester,
  renderer: ArrayRenderer,
};
