import { defaultComparer, Comparer } from "ts-comparer-builder";
import { pipeInto as pp, deferP0 } from "ts-functional-pipe";
import { IndexedSelector } from "../types/IndexedSelector";
import { first } from "./first";
import { minMaxByImpl } from "./helpers/minMaxByImpl";
import { map } from "./map";

/**
 * Computes the maximum value from the source iterable using an optional projection and comparer.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @typeParam TOut - Element type produced by the selector and consumed by the comparer.
 * @param src - Source iterable to evaluate.
 * @param selector - Selector receiving each element and its index, producing the value to compare.
 * @param comparer - Comparer determining ordering between projected values.
 * @returns The greatest projected value, or `undefined` when the source is empty.
 * @throws Error Rethrows any error thrown by `selector` or `comparer`.
 *
 * @example
 * ```ts
 * const result = _max([3, 1, 5, 2]);
 * console.log(result); // 5
 * ```
 *
 * or using the curried version:
 * ```ts
 * const result = pipeInto(
 *   [
 *     { value: 3 },
 *     { value: 7 },
 *     { value: 4 },
 *   ],
 *   max((item) => item.value)
 * );
 * console.log(result); // 7
 * ```
 */
export function _max<T, TOut = T>(
  src: Iterable<T>,
  selector: IndexedSelector<T, TOut> = (x) => x as unknown as TOut,
  comparer: Comparer<TOut> = defaultComparer
): TOut | undefined {
  return pp(
    src,
    map(selector),
    minMaxByImpl(
      (x) => x,
      (a, b) => comparer(a, b)
    ),
    first()
  );
}

/**
 * Curried version of {@link _max}.
 */
export const max = deferP0(_max);
