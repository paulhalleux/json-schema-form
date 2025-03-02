import React from "react";
import { clsx } from "clsx";

import type { PolymorphicProps } from "../../types/polymorphic.ts";

import { ReorderStateContext } from "./helpers.ts";

type ReorderDropIndicatorProps<Element extends React.ElementType = "div"> =
  PolymorphicProps<Element>;

export function ReorderDropIndicator<
  Element extends React.ElementType = "div",
>({ as, children, className, ...props }: ReorderDropIndicatorProps<Element>) {
  const Component = as || "div";
  const { state } = React.useContext(ReorderStateContext) ?? {};

  if (!state || state.type !== "dragging-over") {
    return null;
  }

  return (
    <Component
      className={clsx(
        "absolute h-[2px] left-0 right-0 z-10",
        {
          "top-[-1px]": state.closestEdge === "top",
          "bottom-[-1px]": state.closestEdge === "bottom",
        },
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
