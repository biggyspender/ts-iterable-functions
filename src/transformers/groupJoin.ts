import { deferP0 } from "ts-functional-pipe";
import { toIterable } from "../helpers/toIterable";
import { IndexedSelector } from "../types/IndexedSelector";
import { MapFactory } from "../types/MapFactory";
import { _toLookup } from "./toLookup";

export function _groupJoin<T, TInner, TKey, TOut>(
  src: Iterable<T>,
  innerSeq: Iterable<TInner>,
  outerKeySelector: IndexedSelector<T, TKey>,
  innerKeySelector: IndexedSelector<TInner, TKey>,
  selector: (o: T, v: Iterable<TInner>) => TOut,
  mapFactory?: MapFactory<TKey>
): Iterable<TOut> {
  return toIterable(function* () {
    const innerSeqIt = innerSeq;
    const lookup = _toLookup(innerSeqIt, innerKeySelector, mapFactory);
    const outerSeq = src;

    let i = 0;
    for (const outerItem of outerSeq) {
      const idx = i++;
      const key = outerKeySelector(outerItem, idx);
      const innerItems: Iterable<TInner> = lookup.get(key) ?? [];

      yield selector(outerItem, innerItems);
    }
  });
}
export const groupJoin = deferP0(_groupJoin);
