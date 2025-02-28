import React, { memo, useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

import { NavButton } from "./NavButton.tsx";

type CollapsibleProps = React.PropsWithChildren<{
  title: string;
  defaultOpen?: boolean;
}>;

export const Collapsible = memo(function Collapsible({
  children,
  title,
  defaultOpen = false,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="flex flex-col gap-2">
      <NavButton onClick={() => setIsOpen((prev) => !prev)}>
        {isOpen ? (
          <ChevronDownIcon size={14} />
        ) : (
          <ChevronRightIcon size={14} />
        )}
        <span className="ml-1.5">{title}</span>
      </NavButton>
      {isOpen && children}
    </div>
  );
});
