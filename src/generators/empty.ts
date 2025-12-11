/**
 * Returns an empty iterable of type T.
 *
 * @template T The type of elements in the iterable.
 * @returns {Iterable<T>} An empty iterable.
 */
export const empty = <T>(): Iterable<T> => [] as Iterable<T>;
