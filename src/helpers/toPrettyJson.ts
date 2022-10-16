export const toPrettyJson = (() => {
  const isIterable = (obj: unknown): obj is Iterable<unknown> =>
    obj != null &&
    !Array.isArray(obj) &&
    typeof obj !== "string" &&
    Symbol.iterator in obj;
  const replacer = (_: string, v: unknown) => (isIterable(v) ? [...v] : v);
  return (obj: unknown) => JSON.stringify(obj, replacer, 2);
})();
