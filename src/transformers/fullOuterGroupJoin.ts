import { IndexedSelector } from '../types/IndexedSelector'
import { _toLookup } from './toLookup'
import { deferP0, pipeInto as pp } from 'ts-functional-pipe'
import { map, _map } from './map'
import { distinct } from './distinct'
import { concat } from './concat'
import { MapFactory } from '../types/MapFactory'
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
    const rightLookupKeys = _map(rightLookup, ([key, _]) => key)
    const allKeys = pp(
      leftLookup,
      map(([key, _]) => key),
      concat(rightLookupKeys),
      distinct()
    )

    const outputVals = pp(
      allKeys,
      map((key) => ({ key, leftItem: leftLookup.get(key) || [] })),
      map(({ key, leftItem }) => ({
        key,
        leftItem,
        rightItem: rightLookup.get(key) || [],
      })),
      map((x) => selector(x.leftItem, x.rightItem, x.key))
    )
    for (const v of outputVals) {
      yield v
    }
  })
}

export const fullOuterGroupJoin = deferP0(_fullOuterGroupJoin)
