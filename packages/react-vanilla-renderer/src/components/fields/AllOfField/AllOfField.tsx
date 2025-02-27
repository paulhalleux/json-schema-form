import { useMemo } from "react";
import { AllOfMerger } from "@phalleux/jsf-schema-utils/src";

import { BaseFieldProps, JsonSchema } from "../../JsonSchema.tsx";

export function AllOfField({ path, schema }: BaseFieldProps) {
  const merged = useMemo(() => AllOfMerger.merge(schema), [schema]);
  if (typeof merged !== "object") {
    return null;
  }
  return <JsonSchema path={path} schema={merged} />;
}
