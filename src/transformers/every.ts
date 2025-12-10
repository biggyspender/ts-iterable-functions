import { deferP0 } from "ts-functional-pipe";
import { IndexedPredicate } from "../types/IndexedPredicate";
import { _some } from "./some";

/**
 * Determines whether every element in the source iterable satisfies the predicate.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @param src - Source iterable to test.
 * @param pred - Predicate receiving each element and its index; must return `true` for all elements.
 * @returns `true` when every invocation of `pred` returns truthy; otherwise `false`.
 * @throws Error Rethrows any error thrown by `pred`.
 *
 * @example
 * ```ts
 * const allEven = _every([2, 4, 6], (value) => value % 2 === 0);
 * console.log(allEven); // true
 * ```
 *
 * or using the curried version:
 * ```ts
 * const allEven = pipeInto([2, 4, 6], every((value) => value % 2 === 0));
 * console.log(allEven); // true
 * ```
 */
export function _every<T>(
  src: Iterable<T>,
  pred: IndexedPredicate<T>
): boolean {
  return !_some(src, (item, i) => !pred(item, i));
}

/**
 * Curried version of {@link _every}.
 */
export const every = deferP0(_every);
