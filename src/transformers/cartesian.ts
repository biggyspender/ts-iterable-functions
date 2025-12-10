import { pipeInto as pp } from "ts-functional-pipe";
import { empty } from "../generators/empty";
import { fromSingleValue } from "../generators/fromSingleValue";
import { aggregate } from "./aggregate";
import { append } from "./append";
import { flatMap } from "./flatMap";
import { map } from "./map";

/**
 * Computes the cartesian product of the provided sequences while preserving source order.
 *
 * @typeParam T - Element type produced by each source iterable.
 * @param sequences - Iterable of iterables for which to compute the cartesian product.
 * @returns A deferred iterable yielding every ordered combination of the source sequences.
 * @example
 * ```ts
 * const combinations = [
 *   ...cartesian([
 *     ["A", "B"],
 *     [1, 2],
 *   ].map((arr) => arr.values())),
 * ].map((combo) => [...combo]);
 * console.log(combinations); // [["A", 1], ["A", 2], ["B", 1], ["B", 2]]
 * ```
 */
export const cartesian = <T>(
  sequences: Iterable<Iterable<T>>
): Iterable<Iterable<T>> => {
  const emptyProduct = fromSingleValue(empty<T>());
  return pp(
    sequences,
    aggregate(emptyProduct, (accumulator, sequence) =>
      pp(
        accumulator,
        flatMap((accSeq) =>
          pp(
            sequence,
            map((item) => pp(accSeq, append(item)))
          )
        )
      )
    )
  );
};
