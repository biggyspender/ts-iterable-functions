import { deferP0 } from "ts-functional-pipe";
import { toIterable } from "../helpers/toIterable";
import { IndexedPredicate } from "../types/IndexedPredicate";

export function _takeWhile<T>(
  src: Iterable<T>,
  pred: IndexedPredicate<T>
): Iterable<T> {
  return toIterable(function* () {
    let i = 0;
    for (const item of src) {
      const result = pred(item, i++);
      if (!result) {
        break;
      }
      yield item;
    }
  });
}

export const takeWhile = deferP0(_takeWhile);
