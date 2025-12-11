import { headTail } from "../helpers/headTail";
import { _aggregate } from "./aggregate";

/**
 * Aggregates a sequence into a single result by iteratively combining elements.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @typeParam TOut - Accumulator result type when a distinct seed is supplied.
 * @typeParam TT - Effective accumulator type when `seed` is optional.
 * @param src - Source iterable to be reduced.
 * @param aggFunc - Combiner invoked with the previous accumulator, current element, and current index.
 * @param seed - Optional initial accumulator; falls back to the first element when omitted.
 * @returns The final accumulator produced after the reducer runs over the entire sequence.
 * @throws {Error} If `seed` is omitted and the source iterable is empty.
 * @example
 * ```ts
 * const total = _reduce([1, 2, 3], (prev, curr) => prev + curr);
 * console.log(total); // 6
 *
 * const product = _reduce([1, 2, 3], (prev, curr) => prev * curr, 1);
 * console.log(product); // 6
 * ```
 */
export function _reduce<T, TOut>(
  src: Iterable<T>,
  aggFunc: (prev: TOut, curr: T, idx: number) => TOut,
  seed: TOut,
): TOut;
export function _reduce<T>(
  src: Iterable<T>,
  aggFunc: (prev: T, curr: T, idx: number) => T,
): T;
export function _reduce<T, TOut, TT extends T | TOut>(
  src: Iterable<T>,
  aggFunc: (prev: TT, curr: T, idx: number) => TT,
  seed?: TT,
): TT {
  if (typeof seed !== "undefined") {
    return _aggregate(src, seed, aggFunc);
  } else {
    const [head, tail] = headTail(src);
    return _aggregate(tail, head as unknown as TT, aggFunc);
  }
}

/**
 * Curried version of {@link _reduce}.
 */
export function reduce<T, TOut>(
  aggFunc: (prev: TOut, curr: T, idx: number) => TOut,
  seed: TOut,
): (source: Iterable<T>) => TOut;
export function reduce<T>(
  aggFunc: (prev: T, curr: T, idx: number) => T,
): (source: Iterable<T>) => T;
export function reduce<T, TOut, TT extends T | TOut>(
  aggFunc: (prev: TT, curr: T, idx: number) => TT,
  seed?: TT,
): (source: Iterable<T>) => TT {
  return (source: Iterable<T>) => _reduce(source, aggFunc, seed as TT);
}
