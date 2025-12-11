import { pipeInto as pp } from "ts-functional-pipe";
import { reduce } from "./reduce";
import { reverse } from "./reverse";

/**
 * Aggregates a sequence from right to left by iteratively combining elements.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @typeParam TOut - Accumulator result type when a distinct seed is supplied.
 * @typeParam TT - Effective accumulator type when `seed` is optional.
 * @param src - Source iterable to be reduced.
 * @param aggFunc - Combiner invoked with the previous accumulator, current element, and current index counted from the right.
 * @param seed - Optional initial accumulator; falls back to the rightmost element when omitted.
 * @returns The final accumulator after iterating from the last element to the first.
 * @throws {Error} If `seed` is omitted and the source iterable is empty.
 * @example
 * ```ts
 * const diff = _reduceRight([1, 2, 3], (prev, curr) => prev - curr);
 * console.log(diff); // 0 => ((3 - 2) - 1)
 *
 * const total = _reduceRight([1, 2, 3], (prev, curr) => prev + curr, 0);
 * console.log(total); // 6
 * ```
 */
export function _reduceRight<T, TOut>(
  src: Iterable<T>,
  aggFunc: (prev: TOut, curr: T, idx: number) => TOut,
  seed: TOut,
): TOut;
export function _reduceRight<T>(
  src: Iterable<T>,
  aggFunc: (prev: T, curr: T, idx: number) => T,
): T;
export function _reduceRight<T, TOut, TT extends T | TOut>(
  src: Iterable<T>,
  aggFunc: (prev: TT, curr: T, idx: number) => TT,
  seed?: TT,
): TT {
  return pp(src, reverse(), reduce(aggFunc, seed as TT));
}

/**
 * Curried version of {@link _reduceRight}.
 */
export function reduceRight<T, TOut>(
  aggFunc: (prev: TOut, curr: T, idx: number) => TOut,
  seed: TOut,
): (source: Iterable<T>) => TOut;
export function reduceRight<T>(
  aggFunc: (prev: T, curr: T, idx: number) => T,
): (source: Iterable<T>) => T;
export function reduceRight<T, TOut, TT extends T | TOut>(
  aggFunc: (prev: TT, curr: T, idx: number) => TT,
  seed?: TT,
): (source: Iterable<T>) => TT {
  return (source: Iterable<T>) => _reduceRight(source, aggFunc, seed as TT);
}
