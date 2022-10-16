import { deferP0 } from "ts-functional-pipe";
import { IndexedPredicate } from "../types/IndexedPredicate";

export function _singleOrDefault<T>(
  src: Iterable<T>,
  pred: IndexedPredicate<T> = (_) => true
): T | undefined {
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
  return undefined;
}
export const singleOrDefault = deferP0(_singleOrDefault);
