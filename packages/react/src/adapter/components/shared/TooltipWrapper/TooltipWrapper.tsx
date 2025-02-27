import { PropsWithChildren } from "react";

type TooltipWrapperProps = PropsWithChildren<{
  title: string;
}>;

export function TooltipWrapper({ children, title }: TooltipWrapperProps) {
  return (
    <div className="relative group w-min">
      {children}
      <div className="hidden group-hover:block absolute z-10 bg-black text-white text-xs p-1 rounded whitespace-nowrap top-full left-0">
        <pre>{title}</pre>
      </div>
    </div>
  );
}
