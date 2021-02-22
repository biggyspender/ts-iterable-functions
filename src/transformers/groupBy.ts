import { IndexedSelector } from '../types/IndexedSelector'
import { _toLookup } from './toLookup'
import { _select } from './select'
import { deferP0 } from 'ts-functional-pipe'
import { MapFactory } from "../types/MapFactory"
import { GroupedIterable } from '../types/GroupedIterable'

function createGroupedIterable<K, V>(key: K, value: Iterable<V>): GroupedIterable<K, V> {
  return {
    [Symbol.iterator]: function* () {
      for (const x of value) {
        yield x
      }
    },
    key,
    toJSON: () => [...value]
  }
}

export function _groupBy<T, TKey>(
  src: Iterable<T>,
  keySelector: IndexedSelector<T, TKey>,
  mapFactory?: MapFactory<TKey>
): Iterable<GroupedIterable<TKey, T>> {
  const lookup = _toLookup(src, keySelector, mapFactory)

  return _select(lookup, ([key, value]) => {
    const returnValue = createGroupedIterable(key, value)
    return returnValue
  })
}
export const groupBy = deferP0(_groupBy)
