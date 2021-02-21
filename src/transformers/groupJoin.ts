import { IndexedSelector } from '../types/IndexedSelector'
import { deferP0 } from 'ts-functional-pipe'
import { _toLookup } from './toLookup'
import { toIterable } from '../helpers/toIterable'
import { MapFactory } from "../types/MapFactory"

export function _groupJoin<T, TInner, TKey, TOut>(
  src: Iterable<T>,
  innerSeq: Iterable<TInner>,
  outerKeySelector: IndexedSelector<T, TKey>,
  innerKeySelector: IndexedSelector<TInner, TKey>,
  selector: (o: T, v: Iterable<TInner>) => TOut,
  mapFactory?: MapFactory<TKey>
): Iterable<TOut> {
  const innerSeqIt = innerSeq
  const lookup = _toLookup(innerSeqIt, innerKeySelector, mapFactory)
  const outerSeq = src

  return toIterable(function*() {
    let i = 0
    for (const outerItem of outerSeq) {
      let idx = i++
      const key = outerKeySelector(outerItem, idx)
      let innerItems: Iterable<TInner> = lookup.get(key) || []

      yield selector(outerItem, innerItems)
    }
  })
}
export const groupJoin = deferP0(_groupJoin)
