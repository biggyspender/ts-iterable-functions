import { deferP0, pipeInto } from "ts-functional-pipe";
import { IndexedSelector } from "../types/IndexedSelector";
import { map } from "./map";
import { groupBy } from "./groupBy";
import { _first } from "./first";

/**
 * Removes duplicate elements from an iterable by the key produced by {@link keySelector}.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @typeParam K - Key type generated from each element.
 * @param src - Source iterable that may contain duplicate keys.
 * @param keySelector - Selector receiving each element and its index, yielding the key used for distinctness.
 * @returns An iterable yielding the first element encountered for each distinct key.
 * @throws Error Propagates any error thrown by {@link keySelector}.
 *
 * @example
 * ```ts
 * const data = [
 *   { id: 1, value: "a" },
 *   { id: 1, value: "b" },
 *   { id: 2, value: "c" },
 * ];
 *
 * const deduped = [..._deduplicateBy(data, ({ id }) => id)];
 * // deduped === [data[0], data[2]]
 * ```
 */
export function _deduplicateBy<T, K>(
  src: Iterable<T>,
  keySelector: IndexedSelector<T, K>,
): Iterable<T> {
  return pipeInto(
    src,
    groupBy(keySelector),
    map((g) => _first(g)),
  );
}

/**
 * Curried version of {@link _deduplicateBy}.
 */
export const deduplicateBy = deferP0(_deduplicateBy);
