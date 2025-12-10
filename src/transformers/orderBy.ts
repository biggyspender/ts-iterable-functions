import { comparerBuilder } from "ts-comparer-builder";
import { deferP0 } from "ts-functional-pipe";
import OrderedIterable from "./helpers/OrderedIterable";

/**
 * Sorts the source iterable in ascending order based on a key selector.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @typeParam TCmp - Key type produced by the selector.
 * @param src - Source iterable to order.
 * @param selector - Selector receiving each element and returning the key used for ordering.
 * @returns An {@link OrderedIterable} representing the ascending order and supporting chained `thenBy` calls.
 * @throws Error Rethrows any error thrown by `selector`.
 *
 * @example
 * ```ts
 * const words = ["pear", "banana", "fig", "apple"];
 * const byLength = [..._orderBy(words, (word) => word.length)];
 * console.log(byLength); // ["fig", "pear", "apple", "banana"]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const byLength = [
 *   ...pipeInto(
 *     ["pear", "banana", "fig", "apple"],
 *     orderBy((word) => word.length)
 *   ),
 * ];
 * console.log(byLength); // ["fig", "pear", "apple", "banana"]
 * ```
 */
export function _orderBy<T, TCmp>(
  src: Iterable<T>,
  selector: (x: T) => TCmp
): OrderedIterable<T> {
  const builder = comparerBuilder<T>().sortKey(selector);
  return new OrderedIterable<T>(src, builder);
}

/**
 * Curried version of {@link _orderBy}.
 */
export const orderBy = deferP0(_orderBy);
