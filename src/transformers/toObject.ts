import { deferP0, pipeInto } from "ts-functional-pipe";
import { IndexedSelector } from "../types/IndexedSelector";
import { map } from "./map";

/**
 * Constructs an object by projecting keys and values from each element of the source iterable.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @typeParam K - Property key returned by `keySelector`.
 * @typeParam V - Value returned by `valueSelector`.
 * @param arr - Source iterable to enumerate.
 * @param keySelector - Selector producing the property key for each element along with its index.
 * @param valueSelector - Selector producing the property value for each element along with its index.
 * @returns A record keyed by the projected properties with their corresponding values.
 * @throws Error Rethrows any error thrown by `keySelector` or `valueSelector`.
 *
 * @example
 * ```ts
 * const users = [
 *   { id: "u1", name: "Ada" },
 *   { id: "u2", name: "Grace" },
 * ];
 * const lookup = _toObject(
 *   users,
 *   (user) => user.id,
 *   (user) => user.name
 * );
 * console.log(lookup); // { u1: "Ada", u2: "Grace" }
 * ```
 *
 * or using the curried version:
 * ```ts
 * const lookup = pipeInto(
 *   [
 *     { id: "u1", name: "Ada" },
 *     { id: "u2", name: "Grace" },
 *   ],
 *   toObject(
 *     (user) => user.id,
 *     (user) => user.name
 *   )
 * );
 * console.log(lookup); // { u1: "Ada", u2: "Grace" }
 * ```
 */
export function _toObject<T, K extends PropertyKey, V>(
  arr: Iterable<T>,
  keySelector: IndexedSelector<T, K>,
  valueSelector: IndexedSelector<T, V>,
) {
  return pipeInto(
    arr,
    map((v, i) => [keySelector(v, i), valueSelector(v, i)] as const),
    (v) => Object.fromEntries(v) as Record<K, V>,
  );
}

/**
 * Curried version of {@link _toObject}.
 */
export const toObject = deferP0(_toObject);
