import { pipeInto as pp, deferP0 } from "ts-functional-pipe";
import { IndexedSelector } from "../types/IndexedSelector";
import { MapFactory } from "../types/MapFactory";
import { defaultIfEmpty } from "./defaultIfEmpty";
import { flatMap } from "./flatMap";
import { groupJoin } from "./groupJoin";
import { map } from "./map";

/**
 * Performs a left outer join between the source iterable and the supplied sequence.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @typeParam TInner - Element type produced by the inner sequence.
 * @typeParam TKey - Key type returned by both key selector functions.
 * @typeParam TOut - Resulting element type produced by the selector.
 * @param src - Source iterable providing the outer elements.
 * @param innerSeq - Iterable providing the inner elements to match.
 * @param outerKeySelector - Selector extracting the key for each outer element.
 * @param innerKeySelector - Selector extracting the key for each inner element.
 * @param selector - Projection producing the output value for matches, receiving `undefined` when none exist.
 * @param mapFactory - Optional factory supplying the map used to group inner elements.
 * @returns A deferred iterable of projected values including unmatched outer elements.
 * @throws Error Rethrows any error thrown by the selectors or `mapFactory`.
 *
 * @example
 * ```ts
 * const users = [
 *   { id: 1, name: "Ada" },
 *   { id: 2, name: "Grace" },
 * ];
 * const roles = [
 *   { userId: 1, role: "admin" },
 *   { userId: 3, role: "viewer" },
 * ];
 * const joined = [
 *   ..._leftOuterJoin(
 *     users,
 *     roles,
 *     (user) => user.id,
 *     (role) => role.userId,
 *     (user, role) => ({ user: user.name, role: role?.role ?? "none" })
 *   ),
 * ];
 * console.log(joined);
 * // [{ user: "Ada", role: "admin" }, { user: "Grace", role: "none" }]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const users = [
 *   { id: 1, name: "Ada" },
 *   { id: 2, name: "Grace" },
 * ];
 * const roles = [
 *   { userId: 1, role: "admin" },
 *   { userId: 3, role: "viewer" },
 * ];
 * const joined = [
 *   ...pipeInto(
 *     users,
 *     leftOuterJoin(
 *       roles,
 *       (user) => user.id,
 *       (role) => role.userId,
 *       (user, role) => ({ user: user.name, role: role?.role ?? "none" })
 *     )
 *   ),
 * ];
 * console.log(joined);
 * // [{ user: "Ada", role: "admin" }, { user: "Grace", role: "none" }]
 * ```
 */
export function _leftOuterJoin<T, TInner, TKey, TOut>(
  src: Iterable<T>,
  innerSeq: Iterable<TInner>,
  outerKeySelector: IndexedSelector<T, TKey>,
  innerKeySelector: IndexedSelector<TInner, TKey>,
  selector: (outer: T, inner: TInner | undefined) => TOut,
  mapFactory?: MapFactory<TKey>
): Iterable<TOut> {
  return pp(
    src,
    groupJoin(
      innerSeq,
      outerKeySelector,
      innerKeySelector,
      (outer, innerSeq) => ({
        outer,
        innerSeq,
      }),
      mapFactory
    ),
    flatMap(({ outer, innerSeq }) =>
      pp(
        innerSeq,
        defaultIfEmpty(),
        map((i) => selector(outer, i))
      )
    )
  );
}

/**
 * Curried version of {@link _leftOuterJoin}.
 */
export const leftOuterJoin = deferP0(_leftOuterJoin);
