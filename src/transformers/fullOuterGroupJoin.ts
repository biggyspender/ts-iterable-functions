import { IndexedSelector } from '../types/IndexedSelector'
import { _toLookup } from './toLookup'
import { deferP0, pp } from 'ts-functional-pipe'
import { select, _select } from './select'
import { distinct } from './distinct'
import { concat } from './concat'
import { MapFactory } from "../types/MapFactory"
import { toIterable } from '../helpers/toIterable'

export function _fullOuterGroupJoin<T, TRight, TKey, TOut>(
  src: Iterable<T>,
  rightSeq: Iterable<TRight>,
  leftKeySelector: IndexedSelector<T, TKey>,
  rightKeySelector: IndexedSelector<TRight, TKey>,
  selector: (o: Iterable<T>, v: Iterable<TRight>, k: TKey) => TOut,
  mapFactory?: MapFactory<TKey>
): Iterable<TOut> {
  return toIterable(function* () {
    const right = rightSeq
    const leftLookup = _toLookup(src, leftKeySelector, mapFactory)
    const rightLookup = _toLookup(right, rightKeySelector, mapFactory)
    const rightLookupKeys = _select(rightLookup, ([key, _]) => key)
    const allKeys = pp(leftLookup, select(([key, _]) => key), concat(rightLookupKeys), distinct())

    const outputVals = pp(
      allKeys,
      select(key => ({ key, leftItem: leftLookup.get(key) || [] })),
      select(({ key, leftItem }) => ({
        key,
        leftItem,
        rightItem: rightLookup.get(key) || []
      })),
      select(x => selector(x.leftItem, x.rightItem, x.key))
    )
    for (const v of outputVals) {
      yield v;
    }
  })

}

export const fullOuterGroupJoin = deferP0(_fullOuterGroupJoin)
