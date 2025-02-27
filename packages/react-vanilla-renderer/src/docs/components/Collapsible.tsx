import React, { memo, useCallback } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

export const Collapsible = memo(
  ({
    title,
    children,
    defaultExpanded = false,
  }: {
    title: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
  }) => {
    const [isOpen, setIsOpen] = React.useState(defaultExpanded);
    return (
      <div className="flex flex-col gap-1">
        <button
          className="w-full px-2 py-1 gap-1 text-xs text-left  hover:bg-neutral-100 cursor-pointer flex items-center rounded"
          onClick={useCallback(() => setIsOpen((prev) => !prev), [])}
        >
          <span>
            {isOpen ? (
              <ChevronDownIcon size={14} />
            ) : (
              <ChevronRightIcon size={14} />
            )}
          </span>
          {title}
        </button>
        {isOpen && children}
      </div>
    );
  },
);

Collapsible.displayName = "Collapsible";
