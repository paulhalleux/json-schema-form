import React from "react";
import { BaseRendererProps, FormState } from "@phalleux/jsf-core";
import { UseBoundStore } from "zustand/react";
import { StoreApi } from "zustand/vanilla";

declare module "@phalleux/jsf-core" {
  export interface Register {
    store: UseBoundStore<StoreApi<FormState>>;
    rendererType: React.ComponentType<BaseRendererProps>;
  }
}

export * from "./adapter";
export * from "./hooks/useField.ts";
export * from "./hooks/useKeyedArray.ts";
