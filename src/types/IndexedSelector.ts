/**
 * Defines a selector that takes a value `x:T` and number that represents the position of `x` in whichever sequence it is applied to and transforms that `T` into a `TOut`
 * @example {@link _map}
 */
export type IndexedSelector<T, TOut> = (x: T, i: number) => TOut
