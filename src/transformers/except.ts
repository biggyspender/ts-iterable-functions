import { deferP0 } from "ts-functional-pipe";
import { toIterable } from "../helpers/toIterable";
import { SetFactory } from "../types/SetFactory";
import { _filter } from "./filter";

/**
 * Yields elements from the source iterable that do not appear in the exclusion sequence.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @param src - Source iterable providing candidate elements.
 * @param seq - Iterable whose elements are removed from the result if encountered.
 * @param setFactory - Optional factory supplying the set used to track excluded values.
 * @returns A deferred iterable containing items from `src` that are absent in `seq`.
 * @throws Error Rethrows any error thrown by `setFactory`.
 *
 * @example
 * ```ts
 * const remaining = [..._except([1, 2, 3], [2])];
 * console.log(remaining); // [1, 3]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const remaining = [...pipeInto([1, 2, 3], except([2]))];
 * console.log(remaining); // [1, 3]
 * ```
 */
export function _except<T>(
  src: Iterable<T>,
  seq: Iterable<T>,
  setFactory: SetFactory<T> = { createSet: () => new Set() }
): Iterable<T> {
  return toIterable(function* () {
    const set: Set<T> = setFactory.createSet();
    for (const item of seq) {
      set.add(item);
    }
    const outputValues = _filter(src, (item) => !set.has(item));
    for (const v of outputValues) {
      yield v;
    }
  });
}

/**
 * Curried version of {@link _except}.
 */
export const except = deferP0(_except);
