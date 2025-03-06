import { memo, type PropsWithChildren } from "react";

type PlaygroundSectionProps = PropsWithChildren<{
  title: string;
  cols?: number;
  rows?: number;
}>;

export const PlaygroundSection = memo(function PlaygroundSection({
  title,
  children,
  rows = 1,
  cols = 1,
}: PlaygroundSectionProps) {
  return (
    <div
      className="flex flex-col gap-1"
      style={{
        gridRow: `span ${rows}`,
        gridColumn: `span ${cols}`,
      }}
    >
      <h2 className="font-bold text-sm">{title}</h2>
      <div className="bg-white border border-neutral-300 h-full rounded-md overflow-hidden flex flex-col min-h-0">
        {children}
      </div>
    </div>
  );
});
