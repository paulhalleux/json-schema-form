import React from "react";

import type { PolymorphicProps } from "../../types/polymorphic.ts";

import { ReorderStateContext } from "./helpers.ts";

type ReorderDropIndicatorProps<Element extends React.ElementType = "div"> =
  PolymorphicProps<Element>;

export function ReorderDragHandle<Element extends React.ElementType = "div">({
  as,
  children,
  ...props
}: ReorderDropIndicatorProps<Element>) {
  const Component = as || "div";
  const { handleRef } = React.useContext(ReorderStateContext) ?? {};
  return (
    <Component ref={handleRef as any} {...props}>
      {children}
    </Component>
  );
}
