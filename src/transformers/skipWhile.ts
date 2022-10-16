import { deferP0 } from "ts-functional-pipe";
import { toIterable } from "../helpers/toIterable";
import { IndexedPredicate } from "../types/IndexedPredicate";

export function _skipWhile<T>(
  src: Iterable<T>,
  pred: IndexedPredicate<T>
): Iterable<T> {
  return toIterable(function* () {
    let i = 0;
    let skip = true;
    for (const item of src) {
      if (skip) {
        const result = pred(item, i++);
        if (result) {
          continue;
        }
      }
      skip = false;
      yield item;
    }
  });
}
export const skipWhile = deferP0(_skipWhile);
