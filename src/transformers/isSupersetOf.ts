import { deferP0 } from "ts-functional-pipe";
import { SetFactory } from "../types/SetFactory";
import { _isSubsetOf } from "./isSubsetOf";

/**
 * Determines whether the source iterable contains every element from the comparison sequence.
 *
 * @typeParam T - Element type produced by both iterables.
 * @param src - Source iterable that must include all values from `seq`.
 * @param seq - Iterable whose contents are required to appear in `src`.
 * @param setFactory - Optional factory supplying the set used for membership checks.
 * @returns `true` when `src` is a superset of `seq`, otherwise `false`.
 * @throws Error Rethrows any error thrown by `setFactory`.
 *
 * @example
 * ```ts
 * const result = _isSupersetOf([1, 2, 3], [1, 2]);
 * console.log(result); // true
 * ```
 *
 * or using the curried version:
 * ```ts
 * const result = pipeInto(
 *   [1, 2, 3],
 *   isSupersetOf([1, 2])
 * );
 * console.log(result); // true
 * ```
 */
export function _isSupersetOf<T>(
  src: Iterable<T>,
  seq: Iterable<T>,
  setFactory: SetFactory<T> = { createSet: () => new Set() }
): boolean {
  return _isSubsetOf(seq, src, setFactory);
}

/**
 * Curried version of {@link _isSupersetOf}.
 */
export const isSupersetOf = deferP0(_isSupersetOf);
