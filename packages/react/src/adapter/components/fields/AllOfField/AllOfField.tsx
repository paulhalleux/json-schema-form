import { useMemo } from "react";
import { mergeAllOfs } from "@phalleux/jsf-schema-utils/src";

import { BaseFieldProps, JsonSchema } from "../../JsonSchema.tsx";

export function AllOfField({ path, schema }: BaseFieldProps) {
  const merged = useMemo(() => mergeAllOfs(schema), [schema]);
  if (typeof merged !== "object") {
    return null;
  }
  return <JsonSchema path={path} schema={merged} />;
}
