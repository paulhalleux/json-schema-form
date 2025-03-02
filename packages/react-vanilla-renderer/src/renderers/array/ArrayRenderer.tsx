import { memo, useCallback, useMemo, useRef, useState } from "react";
import { isEqual } from "lodash";

import type { BaseRendererProps } from "@phalleux/jsf-core";
import { useArrayField } from "@phalleux/jsf-react";

import { EmptyState, SchemaHeader } from "../../components";

import { ArrayItemRenderer } from "./ArrayItemRenderer.tsx";
import { ArrayItemsNav } from "./ArrayItemsNav.tsx";

export const ArrayRenderer = memo(function ArrayRenderer({
  schema,
  path,
}: BaseRendererProps) {
  const { value, push, remove, reorder } = useArrayField({
    path,
    schema,
  });

  const [selectedItemKey, setSelectedItemKey] = useState(value[0]?.key);
  const latestValue = useRef(value);
  if (!isEqual(latestValue.current, value)) {
    latestValue.current = value;
  }

  const selectedItem = useMemo(() => {
    return value.find((item) => item.key === selectedItemKey);
  }, [selectedItemKey, value]);

  const addItem = useCallback(() => {
    const addedKey = push();
    setSelectedItemKey(addedKey);
  }, [push]);

  const deleteItem = useCallback(
    (index: number) => {
      remove(index);
      setSelectedItemKey((prev) => {
        if (latestValue.current[index]?.key === prev)
          return (
            latestValue.current[index - 1]?.key ??
            latestValue.current[index + 1]?.key
          );
        return prev;
      });
    },
    [remove],
  );

  return (
    <div className="space-y-2 w-full">
      <SchemaHeader title={schema.title} description={schema.description} />
      <div className="flex gap-2 max-h-72">
        <ArrayItemsNav
          value={value}
          addItem={addItem}
          deleteItem={deleteItem}
          reorderItem={reorder}
          enableReorder={!Array.isArray(schema.items)}
          setSelectedItemKey={setSelectedItemKey}
          selectedItemKey={selectedItemKey}
        />
        <div className="flex flex-col p-2 border border-gray-300 rounded-sm w-full overflow-y-auto">
          {selectedItem ? (
            <ArrayItemRenderer
              key={selectedItem.key}
              item={selectedItem}
              schema={schema}
            />
          ) : (
            <EmptyState
              title="No item selected"
              description="Select an item from the list or add a new one."
              buttonText="Add item"
              onClick={addItem}
            />
          )}
        </div>
      </div>
    </div>
  );
});
