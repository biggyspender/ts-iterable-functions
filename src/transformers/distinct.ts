import { deferP0 } from "ts-functional-pipe";
import { SetFactory } from "../types/SetFactory";
import { _distinctBy } from "./distinctBy";

/**
 * Yields only the first occurrence of each value from the source iterable.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @param src - Source iterable enumerated for unique values.
 * @param setFactory - Optional factory supplying the set used to track seen values.
 * @returns A deferred iterable yielding each distinct value while preserving order.
 * @throws Error Rethrows any error thrown by `setFactory`.
 *
 * @example
 * ```ts
 * const unique = [..._distinct([1, 1, 2, 3])];
 * console.log(unique); // [1, 2, 3]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const unique = [...pipeInto([1, 1, 2, 3], distinct())];
 * console.log(unique); // [1, 2, 3]
 * ```
 */
export function _distinct<T>(
  src: Iterable<T>,
  setFactory?: SetFactory<T>
): Iterable<T> {
  return _distinctBy(src, (x) => x, setFactory);
}

/**
 * Curried version of {@link _distinct}.
 */
export const distinct = deferP0(_distinct);
