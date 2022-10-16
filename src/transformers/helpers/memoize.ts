export const memoize = <TIn, TOut>(f: (v: TIn) => TOut): ((v: TIn) => TOut) => {
  const map = new Map<TIn, TOut>();
  return (v: TIn) => {
    if (map.has(v)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return map.get(v)!;
    }
    const result = f(v);
    map.set(v, result);
    return result;
  };
};
