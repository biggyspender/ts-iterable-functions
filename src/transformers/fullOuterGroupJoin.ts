import { deferP0, pipeInto as pp } from "ts-functional-pipe";
import { toIterable } from "../helpers/toIterable";
import { IndexedSelector } from "../types/IndexedSelector";
import { MapFactory } from "../types/MapFactory";
import { concat } from "./concat";
import { distinct } from "./distinct";
import { map, _map } from "./map";
import { _toLookup } from "./toLookup";

export function _fullOuterGroupJoin<T, TRight, TKey, TOut>(
  src: Iterable<T>,
  rightSeq: Iterable<TRight>,
  leftKeySelector: IndexedSelector<T, TKey>,
  rightKeySelector: IndexedSelector<TRight, TKey>,
  selector: (o: Iterable<T>, v: Iterable<TRight>, k: TKey) => TOut,
  mapFactory?: MapFactory<TKey>
): Iterable<TOut> {
  return toIterable(function* () {
    const right = rightSeq;
    const leftLookup = _toLookup(src, leftKeySelector, mapFactory);
    const rightLookup = _toLookup(right, rightKeySelector, mapFactory);
    const rightLookupKeys = _map(rightLookup, ([key, _]) => key);
    const allKeys = pp(
      leftLookup,
      map(([key, _]) => key),
      concat(rightLookupKeys),
      distinct()
    );

    const outputValues = pp(
      allKeys,
      map((key) => ({ key, leftItem: leftLookup.get(key) ?? [] })),
      map(({ key, leftItem }) => ({
        key,
        leftItem,
        rightItem: rightLookup.get(key) ?? [],
      })),
      map((x) => selector(x.leftItem, x.rightItem, x.key))
    );
    for (const v of outputValues) {
      yield v;
    }
  });
}

export const fullOuterGroupJoin = deferP0(_fullOuterGroupJoin);
