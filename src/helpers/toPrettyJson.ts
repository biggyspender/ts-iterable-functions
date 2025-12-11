/**
 * Converts a given value to a pretty-printed JSON string.
 *
 * If the value contains custom iterables (excluding arrays), they are converted to arrays
 * before serialization to ensure proper representation in the output JSON.
 *
 * @param obj - The value to serialize to JSON.
 * @returns A pretty-printed JSON string representation of the input value.
 */
export const toPrettyJson = (() => {
  const isIterable = (obj: unknown): obj is Iterable<unknown> =>
    typeof obj === "object" &&
    obj != null &&
    !Array.isArray(obj) &&
    Symbol.iterator in obj;
  const replacer = (_: string, v: unknown) => (isIterable(v) ? [...v] : v);
  return (obj: unknown) => JSON.stringify(obj, replacer, 2);
})();
