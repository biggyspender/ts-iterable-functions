import { pipeInto as pp, deferP0 } from "ts-functional-pipe";
import { IndexedSelector } from "../types/IndexedSelector";
import { MapFactory } from "../types/MapFactory";
import { defaultIfEmpty } from "./defaultIfEmpty";
import { flatMap } from "./flatMap";
import { groupJoin } from "./groupJoin";
import { map } from "./map";

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
export const leftOuterJoin = deferP0(_leftOuterJoin);
