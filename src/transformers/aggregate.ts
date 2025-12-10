import { deferP0 } from "ts-functional-pipe";

/**
 * Aggregates all elements from the source iterable into a single value using the provided accumulator.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @typeParam TOut - Accumulator result type yielded after processing the entire sequence.
 * @param src - Source iterable whose elements will feed into the accumulator function.
 * @param seed - Initial accumulator value supplied to the first call of `aggFunc`.
 * @param aggFunc - Combiner invoked with the previous accumulator, current element, and current index.
 * @returns The final accumulator value after iterating through the entire source.
 *
 * @example
 * ```ts
 * const total = _aggregate([1, 2, 3], 0, (acc, n) => acc + n);
 * console.log(total); // 6
 * ```
 *
 * or using the curried version:
 * ```ts
 * const total = pipeInto(
 *   [1, 2, 3],
 *   aggregate(0, (acc, n) => acc + n)
 * );
 * console.log(total); // 6
 * ```
 */
export function _aggregate<T, TOut>(
  src: Iterable<T>,
  seed: TOut,
  aggFunc: (prev: TOut, curr: T, idx: number) => TOut
): TOut {
  let v = seed;
  let i = 0;
  for (const item of src) {
    v = aggFunc(v, item, i++);
  }
  return v;
}

/**
 * Curried version of {@link _aggregate}.
 */
export const aggregate = deferP0(_aggregate);
