import { toIterable } from "../helpers/toIterable";
import { IndexedPredicate } from "../types/IndexedPredicate";
import { TypeGuardPredicate } from "../types/TypeGuardPredicate";
import { _indexed } from "./indexed";

/**
 * creates a new sequence with every item of the source sequence for which the predicate function
 * returns a truthy/falsy value, optionally narrowing the type of the returned iterable (if a type-guard
 * predicate is supplied)
 *
 * @remarks
 * deferred version of {@link _filter}
 *
 * @param src source sequence
 *
 * @param pred a function that returns a truthy value to signal inclusion or a falsy value to exclude.
 * Alternatively a type-guard function can be supplied
 *
 * @returns a new (possibly shorter) sequence with some items filtered away.
 * If a type-guard (i.e. function returns something like `val is S`) is supplied for `pred`, then the
 * resulting sequence will be narrowed to `Iterable<S>`
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
 * creates a new sequence with every item of the source sequence for which the predicate function
 * returns a truthy/falsy value, optionally narrowing the type of the returned iterable (if a type-guard
 * predicate is supplied)
 *
 * @param src source sequence
 *
 * @param pred a function that returns a truthy value to signal inclusion or a falsy value to exclude.
 * Alternatively a type-guard function can be supplied
 *
 * @returns a new (possibly shorter) sequence with some items filtered away.
 * If a type-guard (i.e. function returns something like `val is S`) is supplied for `pred`, then the
 * resulting sequence will be narrowed to `Iterable<S>`
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
