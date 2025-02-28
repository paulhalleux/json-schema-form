import { memo, useCallback } from "react";
import { useNavigate } from "react-router";
import { clsx } from "clsx";
import { ArrowRightIcon, BoxesIcon } from "lucide-react";

import { SchemaExample, SchemaExampleCategory } from "../types/examples.ts";

import { Collapsible } from "./Collapsible.tsx";
import { NavButton } from "./NavButton.tsx";

type SidebarProps = {
  name: string;
  activeExampleId: string | undefined;
  examples: SchemaExampleCategory["children"];
};

export const Sidebar = memo(function Sidebar({
  activeExampleId,
  examples,
  name,
}: SidebarProps) {
  const navigate = useNavigate();

  const onPlaygroundClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div
      className={clsx([
        "w-80 h-full shrink-0 p-2",
        "bg-white border-r border-neutral-300",
        "overflow-y-auto",
      ])}
    >
      <header className="py-1 px-2 flex flex-col mb-2">
        <span className="text-neutral-900 text-lg font-bold flex items-center">
          <BoxesIcon size={14} className="mr-2 mt-[1px]" />
          <span>Schema playground</span>
        </span>
        <span className="text-neutral-700 text-xs font-medium">{name}</span>
      </header>
      <div className="flex flex-col gap-1">
        <NavButton onClick={onPlaygroundClick} className="my-1.5">
          <ArrowRightIcon size={14} className="mr-2" />
          Playground
        </NavButton>
        <h2 className="text-neutral-800 text-sm font-semibold px-2 mb-1">
          Examples
        </h2>
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

  const onNavButtonClick = useCallback(() => {
    navigate(`/example/${categoryOrExample.id}`);
  }, [categoryOrExample.id, navigate]);

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
        onClick={onNavButtonClick}
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
