/**
 * Wraps a generator function to provide an iterable object with additional functionality.
 *
 * The returned object implements the `Iterable` protocol using the provided generator function,
 * and also provides a `toJSON` method that returns all generated values as an array, meaning that
 * JSON.stringify will work as expected.
 *
 * @typeParam T - The type of elements produced by the generator function.
 * @typeParam TF - The type of the generator function, which returns an `IterableIterator<T>`.
 * @param f - A generator function that returns an `IterableIterator<T>`.
 * @returns An object implementing `Iterable<T>` and a `toJSON` method for serialization.
 */
export function toIterable<T, TF extends () => IterableIterator<T>>(f: TF) {
  return {
    [Symbol.iterator]: f,
    toJSON(): T[] {
      return [...f()];
    },
  };
}
