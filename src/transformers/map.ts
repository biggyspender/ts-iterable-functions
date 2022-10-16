import { deferP0 } from "ts-functional-pipe";
import { toIterable } from "../helpers/toIterable";
import { IndexedSelector } from "../types/IndexedSelector";

/**
 * Creates a new sequence populated with the results of calling a provided function on every element in the source sequence
 * @param src source sequence
 * @param selector function to transform each item `T` in the source sequence into `TOut`
 * @returns A new sequence with each element being the result of the selector function.
 */
export function _map<T, TOut>(
  src: Iterable<T>,
  selector: IndexedSelector<T, TOut>
): Iterable<TOut> {
  return toIterable(function* () {
    let c = 0;
    for (const x of src) {
      yield selector(x, c++);
    }
  });
}

/**
 * Creates a new sequence populated with the results of calling a provided function on every element in the source sequence
 * @remarks
 * {@link https://biggyspender.github.io/ts-functional-pipe/globals.html#deferp0 P0 deferred} version of {@link _map}
 * @param src source sequence
 * @param selector function to transform each item `T` in the source sequence into `TOut`
 * @returns A new sequence with each element being the result of the selector function.
 */

export const map = deferP0(_map);
