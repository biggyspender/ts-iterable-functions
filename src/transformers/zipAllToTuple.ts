import { deferP0 } from "ts-functional-pipe";
import { toIterable } from "../helpers/toIterable";

/**
 * Zips multiple iterables into tuples containing the co-indexed elements from each source.
 *
 * @typeParam T - Tuple type describing the elements produced by each input iterable.
 * @param src - Iterable providing the iterables to zip.
 * @returns A deferred iterable yielding tuples of aligned elements.
 * @throws Error Rethrows any error thrown while enumerating the source iterables.
 *
 * @example
 * ```ts
 * const sources: Iterablified<[number, string]> = [
 *   [1, 2, 3],
 *   ["a", "b", "c"],
 * ];
 * const pairs = Array.from(_zipAllToTuple(sources));
 * console.log(pairs); // [[1, "a"], [2, "b"], [3, "c"]]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const pairs = Array.from(
 *   pipeInto(
 *     [
 *       [1, 2],
 *       ["x", "y"],
 *     ] as Iterablified<[number, string]>,
 *     zipAllToTuple()
 *   )
 * );
 * console.log(pairs); // [[1, "x"], [2, "y"]]
 * ```
 */
export function _zipAllToTuple<T extends readonly unknown[]>(
  src: Iterablified<T>
): Iterable<T> {
  return toIterable(function* () {
    const iterators = src.map((iterable) =>
      iterable[Symbol.iterator]()
    ) as unknown as Iteratorfied<T>;
    for (;;) {
      const itRes = iterators.map((it) =>
        it.next()
      ) as unknown as IteratorResultified<T>;
      if (itRes.some((r) => r.done)) {
        break;
      }
      const v = itRes.map((r) => r.value) as unknown as T;
      yield v;
    }
  });
}

/**
 * Curried version of {@link _zipAllToTuple}.
 */
export const zipAllToTuple = deferP0(_zipAllToTuple);

/**
 * Converts a readonly tuple type into a corresponding tuple of iterables,
 * where each position exposes an iterable of the original element type.
 */
export type Iterablified<T extends readonly unknown[]> = {
  [P in keyof T]: Iterable<T[P]>;
};
type Iteratorfied<T extends readonly unknown[]> = {
  [P in keyof T]: Iterator<T[P]>;
};
type IteratorResultified<T extends readonly unknown[]> = {
  [P in keyof T]: IteratorResult<T[P]>;
};
