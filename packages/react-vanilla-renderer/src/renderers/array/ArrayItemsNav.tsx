import React, { memo, useCallback } from "react";
import { clsx } from "clsx";
import { GripVerticalIcon, Trash2Icon } from "lucide-react";

import { Reorder } from "@phalleux/jsf-react";

type ArrayItemsNavProps = {
  value: any[];
  addItem: () => void;
  deleteItem: (index: number) => void;
  reorderItem: (fromIndex: number, toIndex: number) => void;
  setSelectedItemKey: (key: string) => void;
  selectedItemKey: string | undefined;
  enableReorder?: boolean;
};

export const ArrayItemsNav = memo(function ArrayItemsNav({
  value,
  addItem,
  deleteItem,
  reorderItem,
  setSelectedItemKey,
  selectedItemKey,
  enableReorder = true,
}: ArrayItemsNavProps) {
  return (
    <div className="flex flex-col gap-2 w-48 shrink-0">
      <button
        type="button"
        onClick={addItem}
        className="w-full text-left h-7 px-2 text-sm cursor-pointer bg-neutral-100 hover:bg-neutral-200 rounded-sm shrink-0"
      >
        Add
      </button>
      {value.length > 0 && (
        <Reorder
          role="tablist"
          className="overflow-y-auto border border-gray-300 rounded-sm"
          onReorder={reorderItem}
          disabled={!enableReorder}
        >
          {value.map((item, index) => {
            return (
              <ArrayItemsNavItem
                key={item.key}
                item={item}
                index={index}
                deleteItem={deleteItem}
                setSelectedItemKey={setSelectedItemKey}
                isSelected={item.key === selectedItemKey}
                enableReorder={enableReorder}
              />
            );
          })}
        </Reorder>
      )}
    </div>
  );
});

type ArrayItemsNavItemProps = {
  item: any;
  index: number;
  deleteItem: (index: number) => void;
  setSelectedItemKey: (key: string) => void;
  isSelected: boolean;
  enableReorder?: boolean;
};

const ArrayItemsNavItem = memo(function ArrayItemsNavItem({
  item,
  index,
  deleteItem,
  setSelectedItemKey,
  isSelected,
  enableReorder = true,
}: ArrayItemsNavItemProps) {
  const onClick = useCallback(
    () => setSelectedItemKey(item.key),
    [item.key, setSelectedItemKey],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") setSelectedItemKey(item.key);
    },
    [item.key, setSelectedItemKey],
  );

  const onDelete = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      deleteItem(index);
    },
    [deleteItem, index],
  );

  return (
    <Reorder.Item
      index={index}
      role="tab"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={clsx(
        "flex items-center select-none relative shrink-0",
        "outline-none focus:outline-none focus:bg-neutral-100",
        "w-full text-left h-7 px-2 text-sm cursor-pointer hover:bg-neutral-100",
        {
          "!bg-neutral-200 ": isSelected,
        },
      )}
    >
      {enableReorder && (
        <>
          <Reorder.DropIndicator className="bg-blue-700" />
          <Reorder.DragHandle className="h-5 w-5 mr-1 -ml-1 hover:bg-black/5 rounded-sm cursor-pointer flex items-center justify-center">
            <GripVerticalIcon size={14} />
          </Reorder.DragHandle>
        </>
      )}
      {item.key}
      <button
        type="button"
        onClick={onDelete}
        className="ml-auto h-5 w-5 -mr-1 hover:bg-black/5 rounded-sm cursor-pointer flex items-center justify-center"
      >
        <Trash2Icon size={14} />
      </button>
    </Reorder.Item>
  );
});
