import { WritableDraft } from "immer";

/**
 * {@link StoreApi}
 * ---
 * This type is used to define the default store API
 * It includes the state, the function to get the state, the function to set the state, the function to subscribe to the store
 */
export type StoreApi<T> = {
  getState: () => T;
  setState: (state: T) => void;
  subscribe: (listener: (state: T, prevState: T) => void) => () => void;
};

/**
 * {@link StoreUpdater}
 * ---
 * This type is used to define the store updater
 * It is a function that takes an updater function and updates the store state using immer
 */
export type StoreUpdater<T> = (
  updater: (draft: WritableDraft<T>) => WritableDraft<T> | void,
) => void;
