import { comparerBuilder } from "ts-comparer-builder";
import { deferP0 } from "ts-functional-pipe";
import OrderedIterable from "./helpers/OrderedIterable";

/**
 * Sorts the source iterable in descending order based on a key selector.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @typeParam TCmp - Key type produced by the selector.
 * @param src - Source iterable to order.
 * @param selector - Selector receiving each element and returning the key used for ordering.
 * @returns An {@link OrderedIterable} representing the descending order and supporting chained `thenByDescending` calls.
 * @throws Error Rethrows any error thrown by `selector`.
 *
 * @example
 * ```ts
 * const scores = [12, 27, 18, 27];
 * const sorted = [..._orderByDescending(scores, (value) => value)];
 * console.log(sorted); // [27, 27, 18, 12]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const sorted = [
 *   ...pipeInto(
 *     [12, 27, 18, 27],
 *     orderByDescending((value) => value)
 *   ),
 * ];
 * console.log(sorted); // [27, 27, 18, 12]
 * ```
 */
export function _orderByDescending<T, TCmp>(
  src: Iterable<T>,
  selector: (x: T) => TCmp,
): OrderedIterable<T> {
  const builder = comparerBuilder<T>().sortKeyDescending(selector);
  return new OrderedIterable<T>(src, builder);
}

/**
 * Curried version of {@link _orderByDescending}.
 */
export const orderByDescending = deferP0(_orderByDescending);
