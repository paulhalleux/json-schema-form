import { memo, useCallback, useMemo, useState } from "react";
import { clsx } from "clsx";
import { Trash2Icon } from "lucide-react";

import type { BaseRendererProps, FormJsonSchema } from "@phalleux/jsf-core";
import { RenderSchema, useArrayField } from "@phalleux/jsf-react";
import { isBooleanStartSchema } from "@phalleux/jsf-schema-utils";

import { EmptyState, SchemaHeader } from "../../components";

export const ArrayRenderer = memo(function ArrayRenderer({
  schema,
  path,
}: BaseRendererProps) {
  const { value, push, remove } = useArrayField({
    path,
    schema,
  });

  const [selectedItemKey, setSelectedItemKey] = useState(value[0]?.key);
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
      if (value[index]?.key === selectedItemKey)
        setSelectedItemKey(value[index - 1]?.key ?? value[index + 1]?.key);
    },
    [remove, selectedItemKey, value],
  );

  return (
    <div className="space-y-2 w-full">
      <SchemaHeader title={schema.title} description={schema.description} />
      <div className="flex gap-2">
        <div className="flex flex-col gap-2 w-48 shrink-0">
          <button
            type="button"
            onClick={addItem}
            className="w-full text-left h-7 px-2 text-sm cursor-pointer bg-neutral-100 hover:bg-neutral-200 rounded-sm"
          >
            Add
          </button>
          {value.length > 0 && (
            <ul
              role="tablist"
              className="max-h-72 overflow-y-auto border border-gray-300 rounded-sm"
            >
              {value.map((item, index) => {
                return (
                  <li
                    role="tab"
                    key={item.key}
                    tabIndex={0}
                    onClick={() => setSelectedItemKey(item.key)}
                    onKeyPress={(event) => {
                      if (event.key === "Enter") setSelectedItemKey(item.key);
                    }}
                    className={clsx(
                      "flex items-center select-none",
                      "outline-none focus:outline-none focus:bg-neutral-100",
                      "w-full text-left h-7 px-2 text-sm cursor-pointer hover:bg-neutral-100",
                      {
                        "!bg-neutral-200 ": item.key === selectedItemKey,
                      },
                    )}
                  >
                    {item.key}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteItem(index);
                      }}
                      className="ml-auto h-5 w-5 -mr-1 hover:bg-black/5 rounded-sm cursor-pointer flex items-center justify-center"
                    >
                      <Trash2Icon size={14} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="flex flex-col p-2 border border-gray-300 rounded-sm w-full">
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

const ArrayItemRenderer = memo(function ArrayItemRenderer({
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
