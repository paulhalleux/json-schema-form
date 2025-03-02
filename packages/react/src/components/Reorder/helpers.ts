import React from "react";

import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

const reorderIdSymbol = Symbol("reorder-id");
export const ReorderContext = React.createContext<string | null>(null);

export function attachReorderId<T extends Record<string, any>>(
  data: T,
  id: string,
): T & { [reorderIdSymbol]: string } {
  return { ...data, [reorderIdSymbol]: id };
}

export function extractReorderId<T extends Record<string, any>>(
  data: T,
): string | undefined {
  return data[reorderIdSymbol as any];
}

export type ReorderState =
  | {
      type: "idle";
    }
  | {
      type: "dragging";
    }
  | {
      type: "dragging-over";
      closestEdge: Edge | null;
    };

export type ReorderStateContextType = {
  state: ReorderState;
  handleRef: React.RefObject<HTMLElement | null>;
};

export const ReorderStateContext =
  React.createContext<ReorderStateContextType | null>(null);
