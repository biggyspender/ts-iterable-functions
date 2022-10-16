import { deferP0 } from "ts-functional-pipe";
import { IndexedPredicate } from "../types/IndexedPredicate";

export function _single<T>(
  src: Iterable<T>,
  pred: IndexedPredicate<T> = (_) => true
): T {
  let itemCount = 0;
  let foundItem: { value: T } | undefined;
  let i = 0;
  for (const item of src) {
    if (pred(item, i++)) {
      ++itemCount;
      if (itemCount > 1) {
        throw Error("sequence contains more than one element");
      }
      foundItem = { value: item };
    }
  }
  if (foundItem) {
    return foundItem.value;
  }
  throw Error("sequence contains no elements");
}

export const single = deferP0(_single);
