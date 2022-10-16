import { pipeInto as pp, deferP0 } from "ts-functional-pipe";
import { IndexedSelector } from "../types/IndexedSelector";
import { MapFactory } from "../types/MapFactory";
import { flatMap } from "./flatMap";
import { groupJoin } from "./groupJoin";
import { _map } from "./map";

export function _join<T, TInner, TKey, TOut>(
  src: Iterable<T>,
  innerSeq: Iterable<TInner>,
  outerKeySelector: IndexedSelector<T, TKey>,
  innerKeySelector: IndexedSelector<TInner, TKey>,
  selector: (outer: T, inner: TInner) => TOut,
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
    flatMap(({ outer, innerSeq }) => _map(innerSeq, (i) => selector(outer, i)))
  );
}
export const join = deferP0(_join);
