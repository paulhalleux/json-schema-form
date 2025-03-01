import React, { useEffect } from "react";

/**
 * Custom hook that memoizes mapped values while keeping unchanged ones.
 * @param items - The list of items to map over.
 * @param getKey - Function to generate a unique key for each item.
 * @param mapFn - Function to map an item to a value.
 * @param deps - Dependencies that, when changed, trigger a full recompute.
 * @returns The memoized mapped array.
 */
export function useMappedMemo<T, U>(
  items: T[],
  getKey: (item: T) => string | number,
  mapFn: (item: T, index: number) => U,
  deps: React.DependencyList,
): U[] {
  const previousMapRef = React.useRef(
    new Map<string | number, { value: U; index: number }>(),
  );

  useEffect(() => {
    previousMapRef.current = new Map<
      string | number,
      { value: U; index: number }
    >();
  }, [items]);

  return React.useMemo(() => {
    const newMap = new Map<string | number, { value: U; index: number }>();

    items.forEach((item, index) => {
      const key = getKey(item);
      const previousEntry = previousMapRef.current.get(key);

      // Recompute if:
      // - The key is new
      // - The index has changed (item moved)
      if (!previousEntry || previousEntry.index !== index) {
        newMap.set(key, { value: mapFn(item, index), index });
      } else {
        newMap.set(key, previousEntry);
      }
    });

    previousMapRef.current = newMap;
    return items.map((item) => newMap.get(getKey(item))!.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, getKey, mapFn, ...deps]);
}
