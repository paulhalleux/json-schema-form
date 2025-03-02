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
};

export function ArrayItemsNav({
  value,
  addItem,
  deleteItem,
  reorderItem,
  setSelectedItemKey,
  selectedItemKey,
}: ArrayItemsNavProps) {
  return (
    <div className="flex flex-col gap-2 w-48 shrink-0">
      <button
        type="button"
        onClick={addItem}
        className="w-full text-left h-7 px-2 text-sm cursor-pointer bg-neutral-100 hover:bg-neutral-200 rounded-sm"
      >
        Add
      </button>
      {value.length > 0 && (
        <Reorder
          role="tablist"
          className="max-h-72 overflow-y-auto border border-gray-300 rounded-sm"
          onReorder={reorderItem}
        >
          {value.map((item, index) => {
            return (
              <ArrayItemsNavItem
                key={item.key}
                item={item}
                index={index}
                deleteItem={deleteItem}
                setSelectedItemKey={setSelectedItemKey}
                selectedItemKey={selectedItemKey}
              />
            );
          })}
        </Reorder>
      )}
    </div>
  );
}

type ArrayItemsNavItemProps = {
  item: any;
  index: number;
  deleteItem: (index: number) => void;
  setSelectedItemKey: (key: string) => void;
  selectedItemKey: string | undefined;
};

function ArrayItemsNavItem({
  item,
  index,
  deleteItem,
  setSelectedItemKey,
  selectedItemKey,
}: ArrayItemsNavItemProps) {
  return (
    <Reorder.Item
      index={index}
      role="tab"
      tabIndex={0}
      onClick={() => setSelectedItemKey(item.key)}
      onKeyDown={(event) => {
        if (event.key === "Enter") setSelectedItemKey(item.key);
      }}
      className={clsx(
        "flex items-center select-none relative shrink-0",
        "outline-none focus:outline-none focus:bg-neutral-100",
        "w-full text-left h-7 px-2 text-sm cursor-pointer hover:bg-neutral-100",
        {
          "!bg-neutral-200 ": item.key === selectedItemKey,
        },
      )}
    >
      <Reorder.DropIndicator className="bg-blue-700" />
      <Reorder.DragHandle className="h-5 w-5 mr-1 -ml-1 hover:bg-black/5 rounded-sm cursor-pointer flex items-center justify-center">
        <GripVerticalIcon size={14} />
      </Reorder.DragHandle>
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
    </Reorder.Item>
  );
}
