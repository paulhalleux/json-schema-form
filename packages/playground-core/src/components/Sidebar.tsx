import { memo } from "react";
import { useNavigate } from "react-router";
import { clsx } from "clsx";

import { SchemaExample, SchemaExampleCategory } from "../types/examples.ts";

import { Collapsible } from "./Collapsible.tsx";
import { NavButton } from "./NavButton.tsx";

type SidebarProps = {
  activeExampleId: string | undefined;
  examples: SchemaExampleCategory["children"];
};

export const Sidebar = memo(function Sidebar({
  activeExampleId,
  examples,
}: SidebarProps) {
  return (
    <div
      className={clsx([
        "w-80 h-full shrink-0",
        "bg-white border-r border-neutral-300",
        "overflow-y-auto",
      ])}
    >
      <header>
        <h1 className="text-sm font-bold px-4 py-2">Examples</h1>
      </header>
      <div className="flex flex-col gap-1 px-4 pb-2">
        {examples.map((child) => (
          <CategoryOrExample
            key={child.id}
            activeExampleId={activeExampleId}
            categoryOrExample={child}
          />
        ))}
      </div>
    </div>
  );
});

const CategoryOrExample = memo(function CategoryOrExample({
  activeExampleId,
  categoryOrExample,
}: {
  activeExampleId: string | undefined;
  categoryOrExample: SchemaExample | SchemaExampleCategory;
}) {
  const navigate = useNavigate();
  if ("children" in categoryOrExample) {
    return (
      <Collapsible
        title={categoryOrExample.title}
        defaultOpen={isChild(activeExampleId, categoryOrExample)}
      >
        <div className="pl-3.5 ml-3.5 border-l border-neutral-300 flex flex-col">
          {categoryOrExample.children.map((child) => (
            <CategoryOrExample
              key={child.id}
              activeExampleId={activeExampleId}
              categoryOrExample={child}
            />
          ))}
        </div>
      </Collapsible>
    );
  } else {
    return (
      <NavButton
        active={activeExampleId === categoryOrExample.id}
        onClick={() => navigate(`/${categoryOrExample.id}`)}
      >
        {categoryOrExample.title}
      </NavButton>
    );
  }
});

const isChild = (
  activeExampleId: string | undefined,
  example: SchemaExample | SchemaExampleCategory,
): boolean =>
  activeExampleId === example.id ||
  ("children" in example &&
    example.children.some((child) => isChild(activeExampleId, child)));
