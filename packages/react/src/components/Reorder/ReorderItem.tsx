import React, { useMemo } from "react";
import { clsx } from "clsx";
import invariant from "tiny-invariant";

import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

import type { PolymorphicProps } from "../../types/polymorphic.ts";

import {
  attachReorderId,
  extractReorderId,
  ReorderContext,
  type ReorderState,
  ReorderStateContext,
} from "./helpers.ts";

type ReorderItemProps<Element extends React.ElementType = "li"> =
  React.PropsWithChildren<{
    index: number;
  }> &
    PolymorphicProps<Element>;

export function ReorderItem<Element extends React.ElementType = "li">({
  index,
  children,
  as,
  className,
  ...props
}: ReorderItemProps<Element>) {
  const Component = as || "ul";

  const { id, disabled } = React.useContext(ReorderContext) ?? {};

  const ref = React.useRef<HTMLElement>(null);
  const handleRef = React.useRef<HTMLElement>(null);

  const [state, setState] = React.useState<ReorderState>({ type: "idle" });

  React.useEffect(() => {
    const element = ref.current;
    invariant(id, "ReorderIdContext should be defined");
    invariant(element, "Element should be defined");
    return combine(
      draggable({
        element,
        dragHandle: handleRef.current ?? undefined,
        canDrag: () => !disabled,
        getInitialData() {
          return attachReorderId({ index }, id);
        },
        onDragStart: () => {
          setState({ type: "dragging" });
        },
        onDrop: () => {
          setState({ type: "idle" });
        },
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            render: () => {},
          });
        },
      }),
      dropTargetForElements({
        element,
        canDrop({ source }) {
          return (
            extractReorderId(source.data) === id && source.data.index !== index
          );
        },
        getData({ input }) {
          return attachClosestEdge(attachReorderId({ index }, id), {
            element,
            input,
            allowedEdges: ["top", "bottom"],
          });
        },
        onDrop: () => {
          setState({ type: "idle" });
        },
        onDragLeave: () => {
          setState({ type: "idle" });
        },
        onDrag: ({ self }) => {
          const closestEdge = extractClosestEdge(self.data);
          setState((current) => {
            if (
              current.type === "dragging-over" &&
              current.closestEdge === closestEdge
            ) {
              return current;
            }
            return { type: "dragging-over", closestEdge };
          });
        },
        onDragEnter: ({ self }) => {
          const closestEdge = extractClosestEdge(self.data);
          setState({ type: "dragging-over", closestEdge });
        },
      }),
    );
  }, [disabled, id, index]);

  return (
    <ReorderStateContext value={useMemo(() => ({ state, handleRef }), [state])}>
      <Component
        className={clsx("relative", className)}
        ref={ref as any}
        {...props}
      >
        {children}
      </Component>
    </ReorderStateContext>
  );
}
