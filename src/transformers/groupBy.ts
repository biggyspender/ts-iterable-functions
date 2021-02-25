import { IndexedSelector } from '../types/IndexedSelector'
import { _toLookup } from './toLookup'
import { _map } from './map'
import { deferP0 } from 'ts-functional-pipe'
import { MapFactory } from '../types/MapFactory'
import { GroupedIterable } from '../types/GroupedIterable'
import { toIterable } from '../helpers/toIterable'

function createGroupedIterable<K, V>(key: K, value: Iterable<V>): GroupedIterable<K, V> {
  return {
    [Symbol.iterator]: function* () {
      for (const x of value) {
        yield x
      }
    },
    key,
    toJSON(): V[] {
      return [...value]
    },
  }
}

export function _groupBy<T, TKey>(
  src: Iterable<T>,
  keySelector: IndexedSelector<T, TKey>,
  mapFactory?: MapFactory<TKey>
): Iterable<GroupedIterable<TKey, T>> {
  return toIterable(function* () {
    const lookup = _toLookup(src, keySelector, mapFactory)
    for (const [key, value] of lookup) {
      yield createGroupedIterable(key, value)
    }
  })
}
export const groupBy = deferP0(_groupBy)
