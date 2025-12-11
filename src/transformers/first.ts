import { deferP0 } from "ts-functional-pipe";
import { IndexedPredicate } from "../types/IndexedPredicate";
import { _indexed } from "./indexed";

/**
 * Returns the first element from the source iterable that satisfies an optional predicate.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @param src - Source iterable evaluated sequentially until a match is found.
 * @param pred - Optional predicate receiving the current value and index; defaults to accepting every value.
 * @returns The first element that matches the predicate.
 * @throws Error - Thrown when the iterable is empty or no element satisfies `pred`.
 *
 * @example
 * ```ts
 * const value = _first(["red", "green", "blue"]);
 * console.log(value); // "red"
 * ```
 *
 * or using the curried version:
 * ```ts
 * const value = pipeInto(
 *   [1, 2, 3, 4],
 *   first((n) => n > 2)
 * );
 * console.log(value); // 3
 * ```
 */
export function _first<T>(src: Iterable<T>, pred?: IndexedPredicate<T>): T {
  for (const [v, i] of _indexed(src)) {
    if (!pred || pred(v, i)) {
      return v;
    }
  }
  throw Error("sequence contains no elements");
}

/**
 * Curried version of {@link _first}.
 */
export const first = deferP0(_first);
