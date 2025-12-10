import { headTail } from "../helpers/headTail";
import { toIterable } from "../helpers/toIterable";

/**
 * Produces the intermediate accumulator values of a reduction over the source iterable.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @typeParam TOut - Accumulator result type when a distinct seed is supplied.
 * @typeParam TT - Effective accumulator type when `seed` is optional.
 * @param src - Source iterable providing values for the running aggregation.
 * @param aggFunc - Combiner invoked with the previous accumulator, current element, and current index.
 * @param seed - Optional initial accumulator; falls back to the first element when omitted.
 * @returns A deferred iterable yielding each intermediate accumulator value in evaluation order.
 * @throws {Error} If `seed` is omitted and the source iterable is empty.
 * @example
 * ```ts
 * const runningTotals = [..._scan([1, 2, 3], (prev, curr) => prev + curr, 0)];
 * console.log(runningTotals); // [1, 3, 6]
 * ```
 */
export function _scan<T, TOut>(
  src: Iterable<T>,
  aggFunc: (prev: TOut, curr: T, idx: number) => TOut,
  seed: TOut
): Iterable<TOut>;
export function _scan<T, _>(
  src: Iterable<T>,
  aggFunc: (prev: T, curr: T, idx: number) => T
): Iterable<T>;
export function _scan<T, TOut, TT extends T | TOut>(
  src: Iterable<T>,
  aggFunc: (prev: TT, curr: T, idx: number) => TT,
  seed?: TT
): Iterable<TT> {
  return toIterable(function* () {
    let v: TT;
    let s: Iterable<T>;
    if (typeof seed !== "undefined") {
      v = seed;
      s = src;
    } else {
      const ht = headTail(src);
      v = ht[0] as unknown as TT;
      s = ht[1];
    }
    let i = 0;
    for (const item of s) {
      v = aggFunc(v, item, i++);
      yield v;
    }
  });
}

/**
 * Curried version of {@link _scan}.
 */
export function scan<T, TOut>(
  aggFunc: (prev: TOut, curr: T, idx: number) => TOut,
  seed: TOut
): (source: Iterable<T>) => Iterable<TOut>;
export function scan<T>(
  aggFunc: (prev: T, curr: T, idx: number) => T
): (source: Iterable<T>) => Iterable<T>;
export function scan<T, TOut, TT extends T | TOut>(
  aggFunc: (prev: TT, curr: T, idx: number) => TT,
  seed?: TT
): (source: Iterable<T>) => Iterable<TT> {
  return (source: Iterable<T>) => _scan(source, aggFunc, seed as TT);
}
