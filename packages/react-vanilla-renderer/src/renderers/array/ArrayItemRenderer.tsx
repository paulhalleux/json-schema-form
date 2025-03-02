import { memo } from "react";

import type { FormJsonSchema } from "@phalleux/jsf-core";
import { RenderSchema, useArrayField } from "@phalleux/jsf-react";
import { isBooleanStartSchema } from "@phalleux/jsf-schema-utils";

export const ArrayItemRenderer = memo(function ArrayItemRenderer({
  item,
  schema,
}: {
  item: ReturnType<typeof useArrayField>["value"][0];
  schema: FormJsonSchema;
}) {
  if (!item.schema || isBooleanStartSchema(item.schema)) {
    return null;
  }

  return (
    <div className="flex items-center w-full">
      <RenderSchema
        schema={item.schema}
        path={item.path}
        parentSchema={schema}
        previousRenderers={[]}
      />
    </div>
  );
});
