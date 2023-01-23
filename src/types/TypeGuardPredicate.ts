/**
 * Defines a type-guard predicate that takes a value `x:T` and number that represents the position of `x` in whichever sequence
 * and determines if the parameter `x` can be narrowed to type `S`
 * @example {@link _filter}
 */

export type TypeGuardPredicate<T, S extends T> = (x: T, i: number) => x is S;
