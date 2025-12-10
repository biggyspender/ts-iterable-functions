import { defaultComparer, Comparer } from "ts-comparer-builder";
import { pipeInto as pp, deferP0 } from "ts-functional-pipe";
import { IndexedSelector } from "../types/IndexedSelector";
import { first } from "./first";
import { minMaxByImpl } from "./helpers/minMaxByImpl";
import { map } from "./map";

/**
 * Computes the minimum projected value from the source iterable.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @typeParam TOut - Element type produced by the selector and consumed by the comparer.
 * @param src - Source iterable to evaluate.
 * @param selector - Selector receiving each element and its index, producing the value to compare.
 * @param comparer - Comparer determining ordering between projected values; defaults to {@link defaultComparer}.
 * @returns The smallest projected value, or `undefined` when the source is empty.
 * @throws Error Rethrows any error thrown by `selector` or `comparer`.
 *
 * @example
 * ```ts
 * const smallest = _min([3, 1, 5, 2]);
 * console.log(smallest); // 1
 * ```
 *
 * or using the curried version:
 * ```ts
 * const lowestPrice = pipeInto(
 *   [
 *     { id: 1, price: 12 },
 *     { id: 2, price: 8 },
 *     { id: 3, price: 15 },
 *   ],
 *   min((item) => item.price)
 * );
 * console.log(lowestPrice); // 8
 * ```
 */
export function _min<T, TOut = T>(
  src: Iterable<T>,
  selector: IndexedSelector<T, TOut> = (x) => x as unknown as TOut,
  comparer: Comparer<TOut> = defaultComparer
): TOut | undefined {
  return pp(
    src,
    map(selector),
    minMaxByImpl(
      (x) => x,
      (a, b) => -comparer(a, b)
    ),
    first()
  );
}

/**
 * Curried version of {@link _min}.
 */
export const min = deferP0(_min);
