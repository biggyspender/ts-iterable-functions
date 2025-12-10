import { deferP0, pipeInto as pp } from "ts-functional-pipe";
import { map } from "./map";
import { Iterablified, zipAllToTuple } from "./zipAllToTuple";

/**
 * Applies a selector to tuples produced by zipping multiple iterables.
 *
 * @typeParam T - Tuple type describing the zipped elements.
 * @typeParam TOut - Element type yielded by the selector.
 * @param src - Iterable providing the iterables to zip together.
 * @param selector - Function receiving the tuple of aligned elements for transformation.
 * @returns A deferred iterable yielding the selector results for each tuple.
 * @throws Error Rethrows any error thrown by `selector` or while enumerating the source iterables.
 *
 * @example
 * ```ts
 * const inputs: Iterablified<[number, string]> = [
 *   [1, 2],
 *   ["a", "b"],
 * ];
 * const labels = Array.from(
 *   _zipMap(inputs, (value, letter) => `${value}${letter}`)
 * );
 * console.log(labels); // ["1a", "2b"]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const labels = Array.from(
 *   pipeInto(
 *     [
 *       [10, 20],
 *       ["x", "y"],
 *     ] as Iterablified<[number, string]>,
 *     zipMap((value, letter) => `${value}${letter}`)
 *   )
 * );
 * console.log(labels); // ["10x", "20y"]
 * ```
 */
export function _zipMap<T extends readonly unknown[], TOut>(
  src: Iterablified<T>,
  selector: (...args: T) => TOut
): Iterable<TOut> {
  return pp(
    src,
    zipAllToTuple(),
    map((args) => selector(...args))
  );
}

/**
 * Curried version of {@link _zipMap}.
 */
export const zipMap = deferP0(_zipMap);
