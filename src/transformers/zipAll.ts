import { deferP0 } from "ts-functional-pipe";
import { _aggregate } from "./aggregate";
import { _append } from "./append";
import { _map } from "./map";
import { _zip } from "./zip";

/**
 * Zips an iterable of iterables into grouped iterables containing elements that share the same index.
 *
 * @typeParam TT - Element type produced by each inner iterable.
 * @param src - Iterable yielding the sequences to zip together.
 * @returns A deferred iterable whose elements are iterables of co-indexed values.
 * @throws Error Rethrows any error thrown while enumerating the source sequences.
 *
 * @example
 * ```ts
 * const sequences = [
 *   [1, 2, 3],
 *   ["a", "b", "c"],
 * ];
 * const grouped = Array.from(_zipAll(sequences), (group) => [...group]);
 * console.log(grouped); // [[1, "a"], [2, "b"], [3, "c"]]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const grouped = Array.from(
 *   pipeInto(
 *     [
 *       [1, 2, 3],
 *       ["a", "b", "c"],
 *       [true, false, true],
 *     ],
 *     zipAll()
 *   ),
 *   (group) => [...group]
 * );
 * console.log(grouped);
 * // [[1, "a", true], [2, "b", false], [3, "c", true]]
 * ```
 */
export function _zipAll<TT>(
  src: Iterable<Iterable<TT>>
): Iterable<Iterable<TT>> {
  const v = _aggregate<Iterable<TT>, Iterable<Iterable<TT>> | undefined>(
    src,
    undefined,
    (acc, curr) =>
      typeof acc === "undefined"
        ? _map(curr, (x) => [x])
        : _zip(acc, curr, (a, c) => _append(a, c))
  );
  return typeof v === "undefined" ? [] : v;
}

/**
 * Curried version of {@link _zipAll}.
 */
export const zipAll = deferP0(_zipAll);
