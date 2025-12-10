import { deferP0 } from "ts-functional-pipe";
import OrderedIterable from "./helpers/OrderedIterable";

/**
 * Adds a secondary ascending sort key to an {@link OrderedIterable}.
 *
 * @typeParam T - Element type contained in the ordered iterable.
 * @typeParam TCmp - Key type produced by the selector.
 * @param src - Ordered iterable produced by {@link _orderBy} or another `thenBy`.
 * @param selector - Selector that derives the additional key used to break ties.
 * @returns An {@link OrderedIterable} extended with the extra ascending key.
 * @throws Error Rethrows any error thrown by `selector`.
 *
 * @example
 * ```ts
 * const items = [
 *   { category: "fruit", name: "banana" },
 *   { category: "vegetable", name: "okra" },
 *   { category: "fruit", name: "apple" },
 * ];
 * const ordered = _orderBy(items, (item) => item.category);
 * const sorted = [..._thenBy(ordered, (item) => item.name)];
 * console.log(sorted);
 * // [
 * //   { category: "fruit", name: "apple" },
 * //   { category: "fruit", name: "banana" },
 * //   { category: "vegetable", name: "okra" },
 * // ]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const sorted = [
 *   ...pipeInto(
 *     [
 *       { category: "fruit", name: "banana" },
 *       { category: "vegetable", name: "okra" },
 *       { category: "fruit", name: "apple" },
 *     ],
 *     orderBy((item) => item.category),
 *     thenBy((item) => item.name)
 *   ),
 * ];
 * console.log(sorted);
 * // [
 * //   { category: "fruit", name: "apple" },
 * //   { category: "fruit", name: "banana" },
 * //   { category: "vegetable", name: "okra" },
 * // ]
 * ```
 */
export function _thenBy<T, TCmp>(
  src: OrderedIterable<T>,
  selector: (x: T) => TCmp
): OrderedIterable<T> {
  return src.createNewFrom((builder) => builder.thenKey(selector));
}
/**
 * Curried version of {@link _thenBy}.
 */
export const thenBy = deferP0(_thenBy);
