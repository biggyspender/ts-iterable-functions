import { deferP0 } from "ts-functional-pipe";
import { IndexedPredicate } from "../types/IndexedPredicate";
import { toIterable } from "../helpers/toIterable";

/**
 * Creates an iterable that yields items from the source sequence until the predicate returns true,
 * including the item that satisfies the predicate.
 *
 * @typeParam T - Type of elements in the source iterable.
 * @param src - The source iterable to consume.
 * @param pred - Predicate applied to each item and its index; iteration stops after it returns true.
 * @returns An iterable that yields items up to and including the first item that satisfies the predicate.
 */
function _takeToInclusive<T>(
  src: Iterable<T>,
  pred: IndexedPredicate<T>
): Iterable<T> {
  return toIterable(function* () {
    let i = 0;
    for (const item of src) {
      const result = pred(item, i++);
      yield item;
      if (result) {
        break;
      }
    }
  });
}

/**
 * Creates an iterable that yields items from the source sequence until the predicate returns true,
 * including the item that satisfies the predicate.
 *
 * @typeParam T - Type of elements in the source iterable.
 * @param src - The source iterable to consume.
 * @param pred - Predicate applied to each item and its index; iteration stops after it returns true.
 * @returns An iterable that yields items up to and including the first item that satisfies the predicate.
 */
export const takeToInclusive = deferP0(_takeToInclusive);
