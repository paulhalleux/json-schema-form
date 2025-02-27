import React from "react";

const generateKey = () => {
  return Math.random().toString(36).substring(7);
};

export function useKeyedArray<T>(initialState: T[]) {
  const [keys, setKeys] = React.useState<string[]>(() =>
    initialState.map(generateKey),
  );

  const push = React.useCallback(() => {
    setKeys((keys) => [...keys, generateKey()]);
  }, []);

  const remove = React.useCallback((index: number) => {
    setKeys((keys) => keys.filter((_, i) => i !== index));
  }, []);

  const reorder = React.useCallback((from: number, to: number) => {
    setKeys((keys) => {
      const copy = [...keys];
      const [removed] = copy.splice(from, 1);
      copy.splice(to, 0, removed);
      return copy;
    });
  }, []);

  const keyedItems = React.useMemo(() => {
    return initialState.map((item, index) => ({ key: keys[index], item }));
  }, [initialState, keys]);

  return [keyedItems, { push, remove, reorder }] as const;
}
