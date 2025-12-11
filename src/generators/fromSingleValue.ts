import { toIterable } from "../helpers/toIterable";

/**
 * Creates an iterable containing a single value.
 *
 * @template T The type of the value.
 * @param {T} item The value to wrap in an iterable.
 * @returns {Iterable<T>} An iterable containing the single value.
 */
export const fromSingleValue = <T>(item: T): Iterable<T> =>
  toIterable(function* () {
    yield item;
  });
