import { deferP0 } from "ts-functional-pipe";
import { IndexedPredicate } from "../types/IndexedPredicate";

export function _firstOrDefault<T>(
  src: Iterable<T>,
  pred: IndexedPredicate<T> = () => true
): T | undefined {
  let i = 0;
  for (const item of src) {
    if (pred(item, i++)) {
      return item;
    }
  }
  return undefined;
}

export const firstOrDefault = deferP0(_firstOrDefault);
