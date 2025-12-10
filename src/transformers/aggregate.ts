import { deferP0 } from "ts-functional-pipe";

/**
 * Aggregates the elements of an iterable sequence into a single value by applying an accumulator function.
 *
 * @template T - The type of elements in the source iterable.
 * @template TOut - The type of the accumulated result.
 * @param src - The source iterable to aggregate.
 * @param seed - The initial accumulator value.
 * @param aggFunc - A function that takes the previous accumulator value, the current element, and the current index, and returns the new accumulator value.
 * @returns The final accumulated value after processing all elements.
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
 * {@inheritDoc _aggregate}
 */
export const aggregate = deferP0(_aggregate);
