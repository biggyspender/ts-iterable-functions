import { toIterable } from "../helpers/toIterable";
/**
 * Creates an iterable of numbers in a range.
 *
 * @param {number} start The starting number (inclusive).
 * @param {number} range The number of elements in the range.
 * @returns {Iterable<number>} An iterable of numbers from start to start + range - 1.
 * @throws {Error} If start or range is not an integer, or if range < 0.
 */
export function range(start: number, range: number): Iterable<number> {
  if (Math.trunc(start) !== start) {
    throw Error("start must be an integral value");
  }
  if (Math.trunc(range) !== range) {
    throw Error("range must be an integral value");
  }
  if (range < 0) {
    throw Error("range must be >= 0");
  }
  return toIterable(function* () {
    for (let i = 0; i < range; ++i) {
      yield i + start;
    }
  });
}
