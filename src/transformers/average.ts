import { deferP0 } from "ts-functional-pipe";
import { _aggregate } from "./aggregate";

/**
 * Computes the arithmetic mean of a numeric iterable, throwing if the sequence is empty.
 *
 * @param src - Source iterable yielding numeric values to average.
 * @returns The arithmetic mean of the input values.
 * @throws Error when the iterable produces no elements.
 *
 * @example
 * ```ts
 * const mean = _average([2, 4, 6]);
 * console.log(mean); // 4
 * ```
 *
 * or using the curried version:
 * ```ts
 * const mean = pipeInto([2, 4, 6], average());
 * console.log(mean); // 4
 * ```
 */
export function _average(src: Iterable<number>): number {
  const f = _aggregate(
    src,
    {
      tot: 0,
      count: 0,
    },
    (acc, val) => {
      acc.tot += val;
      acc.count++;
      return acc;
    }
  );
  if (f.count === 0) {
    throw Error("sequence contains no elements");
  }
  return f.tot / f.count;
}

/**
 * Curried version of {@link _average}
 */
export const average = deferP0(_average);
