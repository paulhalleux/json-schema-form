import { produce } from "immer";

import type { FormState, FormStore } from "../types/core.ts";
import type { StoreUpdater } from "../types/store.ts";

/**
 * Create a new form store using default API
 * ---
 * This function is used to create a new form store using the default API
 * @param initialState Initial state
 */
export function createDefaultStore(initialState: FormState): FormStore {
  let state = initialState;
  const listeners = new Set<(state: FormState, prevState: FormState) => void>();
  return {
    getState: () => state,
    setState: (newState) => {
      const prevState = state;
      state = newState;
      listeners.forEach((listener) => listener(state, prevState));
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

/**
 * Create a store updater
 * ---
 * This function is used to update the store state using immer
 * @param store Store
 */
export function createStoreUpdater(store: FormStore): StoreUpdater<FormState> {
  return (updater) => {
    store.setState(produce(store.getState(), updater));
  };
}
