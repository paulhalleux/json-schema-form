import React, { memo } from "react";
import { clsx } from "clsx";

type NavButtonProps = React.PropsWithChildren<{
  onClick?: () => void;
  active?: boolean;
  className?: string;
}>;

export const NavButton = memo(function NavButton({
  children,
  onClick,
  active,
  className,
}: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center cursor-pointer",
        "text-xs font-medium h-8 w-full text-left px-2 py-1 rounded hover:bg-neutral-100",
        {
          "bg-neutral-100": active,
        },
        className,
      )}
    >
      {children}
    </button>
  );
});
