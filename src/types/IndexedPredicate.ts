/**
 * Defines a predicate that takes a value `x:T` and number that represents the position of `x` in whichever sequence
 * it is applied to and returns a truthy/falsy value, usually to signal inclusion in an output list
 * @example {@link _filter}
 */

export type IndexedPredicate<T> = (x: T, i: number) => unknown;
