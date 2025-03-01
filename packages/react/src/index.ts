import type React from "react";
import type { UseBoundStore } from "zustand/react";
import type { StoreApi } from "zustand/vanilla";

import type { BaseRendererProps, FormState } from "@phalleux/jsf-core";

declare module "@phalleux/jsf-core" {
  export interface Register {
    store: UseBoundStore<StoreApi<FormState>>;
    rendererType: React.ComponentType<BaseRendererProps>;
  }
}

export * from "./adapter";
export * from "./hooks/useField.ts";
export * from "./hooks/useArrayField.ts";
export * from "./hooks/useKeyedArray.ts";
