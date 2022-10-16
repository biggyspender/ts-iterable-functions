import { deferP0 } from "ts-functional-pipe";
import { toIterable } from "../helpers/toIterable";

/**
 * append a single item to the end of a sequence
 * @param src source sequence
 * @param item the item to append
 */
export function _append<T>(src: Iterable<T>, item: T): Iterable<T> {
  return toIterable(function* () {
    for (const x of src) {
      yield x;
    }
    yield item;
  });
}

/**
 * append a single item to the end of a sequence
 * @remarks
 * {@link https://biggyspender.github.io/ts-functional-pipe/globals.html#deferp0 P0 deferred} version of {@link _append}
 * @param src source sequence
 * @param item the item to append
 */
export const append = deferP0(_append);
