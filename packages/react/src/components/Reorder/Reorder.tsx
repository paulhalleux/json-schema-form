import React, { useMemo } from "react";

import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";

import type { PolymorphicProps } from "../../types/polymorphic.ts";

import { extractReorderId, ReorderContext } from "./helpers.ts";
import { ReorderDragHandle } from "./ReorderDragHandle.tsx";
import { ReorderDropIndicator } from "./ReorderDropIndicator.tsx";
import { ReorderItem } from "./ReorderItem.tsx";

type ReorderProps<Element extends React.ElementType> = React.PropsWithChildren<{
  onReorder?: (fromIndex: number, toIndex: number) => void;
  disabled?: boolean;
}> &
  PolymorphicProps<Element>;

export function Reorder<Element extends React.ElementType = "ul">({
  children,
  onReorder,
  as,
  disabled = false,
  ...props
}: ReorderProps<Element>) {
  const Component = as || "ul";

  const id = React.useId();
  const latestOnReorder = React.useRef(onReorder);

  React.useEffect(() => {
    latestOnReorder.current = onReorder;
  }, [onReorder]);

  React.useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) => {
        return extractReorderId(source.data) === id;
      },
      onDrop({ source, location }) {
        const target = location.current.dropTargets[0];
        if (!target) {
          return;
        }

        const fromIndex: number = (source.data.index ?? -1) as number;
        const toIndex: number = (target.data.index ?? -1) as number;

        if (fromIndex === -1 || toIndex === -1) {
          return;
        }

        const actualTargetIndex = getReorderDestinationIndex({
          startIndex: fromIndex,
          indexOfTarget: toIndex,
          axis: "vertical",
          closestEdgeOfTarget: extractClosestEdge(target.data),
        });

        latestOnReorder.current?.(fromIndex, actualTargetIndex);
      },
    });
  }, [id]);

  return (
    <ReorderContext value={useMemo(() => ({ id, disabled }), [id, disabled])}>
      <Component {...props}>{children}</Component>
    </ReorderContext>
  );
}

Reorder.Item = ReorderItem;
Reorder.DropIndicator = ReorderDropIndicator;
Reorder.DragHandle = ReorderDragHandle;
