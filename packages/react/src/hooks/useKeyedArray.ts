import React, { useEffect } from "react";

const generateKey = () => {
  return Math.random().toString(36).substring(7);
};

export function useKeyedArray<T>(arrayItems: T[], deps: React.DependencyList) {
  const [keys, setKeys] = React.useState<string[]>(() =>
    arrayItems.map(generateKey),
  );

  // Need to update keys when components are re-rendered
  // Otherwise, the keys will not be updated
  useEffect(() => {
    setKeys(arrayItems.map(generateKey));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const push = React.useCallback(() => {
    const newKey = generateKey();
    setKeys((keys) => [...keys, newKey]);
    return newKey;
  }, []);

  const remove = React.useCallback((index: number) => {
    setKeys((keys) => keys.filter((_, i) => i !== index));
  }, []);

  const reorder = React.useCallback((from: number, to: number) => {
    setKeys((keys) => {
      const copy = [...keys];
      const [removed] = copy.splice(from, 1);
      if (!removed) return copy;
      copy.splice(to, 0, removed);
      return copy;
    });
  }, []);

  const keyedItems = React.useMemo(() => {
    return arrayItems.map((item, index) => ({ key: keys[index]!, item }));
  }, [arrayItems, keys]);

  return [keyedItems, { push, remove, reorder }] as const;
}
