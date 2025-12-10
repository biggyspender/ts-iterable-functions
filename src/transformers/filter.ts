import { toIterable } from "../helpers/toIterable";
import { IndexedPredicate } from "../types/IndexedPredicate";
import { TypeGuardPredicate } from "../types/TypeGuardPredicate";
import { _indexed } from "./indexed";

/**
 * Filters items from a source iterable using a predicate, optionally narrowing the element type.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @typeParam S - Narrowed element type when `pred` acts as a type guard.
 * @param pred - Predicate invoked with each element and its index to determine inclusion.
 * @returns A transformer that yields every element for which `pred` returns a truthy value.
 * @throws Error Rethrows any error thrown by `pred`.
 * @example
 * ```ts
 * const odds = [
 *   ...pipeInto(
 *     [1, 2, 3, 4],
 *     filter((value) => value % 2 === 1)
 *   ),
 * ];
 * console.log(odds); // [1, 3]
 * ```
 */
export function filter<T, S extends T>(
  pred: TypeGuardPredicate<T, S>
): (src: Iterable<T>) => Iterable<S>;
export function filter<T>(
  pred: IndexedPredicate<T>
): (src: Iterable<T>) => Iterable<T>;
export function filter<T>(
  pred: IndexedPredicate<T>
): (src: Iterable<T>) => Iterable<unknown> {
  return (src: Iterable<T>): Iterable<unknown> =>
    toIterable(function* () {
      const indexedSrc = _indexed(src);
      for (const v of indexedSrc) {
        if (pred(...v)) {
          yield v[0];
        }
      }
    });
}

/**
 * Filters items from a source iterable using a predicate, optionally narrowing the element type.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @typeParam S - Narrowed element type when `pred` acts as a type guard.
 * @param src - Source iterable evaluated synchronously.
 * @param pred - Predicate invoked with each element and its index to determine inclusion.
 * @returns A deferred iterable yielding every element for which `pred` returns a truthy value.
 * @throws Error Rethrows any error thrown by `pred`.
 * @example
 * ```ts
 * const odds = [..._filter([1, 2, 3, 4], (value) => value % 2 === 1)];
 * console.log(odds); // [1, 3]
 * ```
 */
export function _filter<T, S extends T>(
  src: Iterable<T>,
  pred: TypeGuardPredicate<T, S>
): Iterable<S>;
export function _filter<T>(
  src: Iterable<T>,
  pred: IndexedPredicate<T>
): Iterable<T>;
export function _filter<T>(
  src: Iterable<T>,
  pred: IndexedPredicate<T>
): Iterable<unknown> {
  return filter(pred)(src);
}
