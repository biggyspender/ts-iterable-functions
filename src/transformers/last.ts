import { deferP0 } from "ts-functional-pipe";
import { IndexedPredicate } from "../types/IndexedPredicate";

export function _last<T>(
  src: Iterable<T>,
  pred: IndexedPredicate<T> = () => true
): T {
  let i = 0;
  let returnValContainer: { value: T } | undefined;
  //let found = false;
  for (const item of src) {
    if (pred(item, i++)) {
      returnValContainer = { value: item };
    }
  }
  if (returnValContainer) {
    return returnValContainer.value;
  } else {
    throw Error("sequence contains no elements");
  }
}
export const last = deferP0(_last);
