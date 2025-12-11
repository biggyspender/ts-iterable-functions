import { toIterable } from "./toIterable";

/**
 * Returns a tuple containing the first element of the given iterable and a new iterable for the remaining elements.
 *
 * @typeParam T - The type of elements in the source iterable.
 * @param src - The source iterable to extract the head and tail from.
 * @returns A readonly tuple where the first element is the head (first item) and the second element is an iterable of the tail (remaining items).
 * @throws {Error} If the source iterable is empty.
 */
export const headTail = <T>(src: Iterable<T>): readonly [T, Iterable<T>] => {
  const iter = src[Symbol.iterator]();
  const n = iter.next();
  if (n.done) {
    throw Error("sequence is empty");
  } else {
    return [
      n.value,
      toIterable(function* () {
        let next: IteratorResult<T>;
        while (!(next = iter.next()).done) {
          yield next.value;
        }
      }),
    ];
  }
};
