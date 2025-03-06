import { memo } from "react";

import { RenderSchema, useArrayField } from "@phalleux/jsf-react";
import type { ObjectSchema } from "@phalleux/jsf-schema-utils";
import { Schema } from "@phalleux/jsf-schema-utils";

export const ArrayItemRenderer = memo(function ArrayItemRenderer({
  item,
}: {
  item: ReturnType<typeof useArrayField>["value"][0];
}) {
  if (!item.schema || item.schema.isBooleanSchema()) {
    return null;
  }

  return (
    <div className="flex items-center w-full">
      <RenderSchema
        schema={item.schema as Schema<ObjectSchema>}
        path={item.path}
        previousRenderers={[]}
      />
    </div>
  );
});
