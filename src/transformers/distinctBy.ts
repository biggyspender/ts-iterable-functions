import { deferP0 } from "ts-functional-pipe";
import { toIterable } from "../helpers/toIterable";
import { IndexedSelector } from "../types/IndexedSelector";
import { SetFactory } from "../types/SetFactory";

/**
 * Emits source elements while removing duplicates identified by the selector key.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @typeParam TKey - Key type returned by the selector.
 * @param src - Source iterable enumerated for distinct values.
 * @param selector - Selector producing a comparison key for each element.
 * @param setFactory - Optional factory supplying the set used to track seen keys.
 * @returns A deferred iterable yielding the first element for each unique key.
 * @throws Error Rethrows any error thrown by `selector` or `setFactory`.
 *
 * @example
 * ```ts
 * const users = [
 *   { id: 1, name: "Ada" },
 *   { id: 1, name: "Ada" },
 *   { id: 2, name: "Grace" },
 * ];
 * const unique = [..._distinctBy(users, (user) => user.id)];
 * console.log(unique); // [{ id: 1, name: "Ada" }, { id: 2, name: "Grace" }]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const unique = [
 *   ...pipeInto(
 *     [
 *       { id: 1, name: "Ada" },
 *       { id: 1, name: "Ada" },
 *       { id: 2, name: "Grace" },
 *     ],
 *     distinctBy((user) => user.id)
 *   ),
 * ];
 * console.log(unique); // [{ id: 1, name: "Ada" }, { id: 2, name: "Grace" }]
 * ```
 */
export function _distinctBy<T, TKey>(
  src: Iterable<T>,
  selector: IndexedSelector<T, TKey>,
  setFactory: SetFactory<TKey> = { createSet: () => new Set() }
): Iterable<T> {
  return toIterable(function* () {
    const set = setFactory.createSet();
    let i = 0;
    for (const x of src) {
      const idx = i++;
      const key = selector(x, idx);
      if (set.has(key)) {
        continue;
      }
      set.add(key);
      yield x;
    }
  });
}

/**
 * Curried version of {@link _distinctBy}.
 */
export const distinctBy = deferP0(_distinctBy);
