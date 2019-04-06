import { IndexedSelector } from '../types/IndexedSelector'
import { EqualityComparer } from 'ts-equality-comparer'
import { _toLookup } from './toLookup'
import { _select } from './select'
import { deferP0 } from 'ts-functional-pipe'

interface GroupedIterable<K, V> extends Iterable<V> {
  key: K
}

function createGroupedIterable<K, V>(key: K, value: Iterable<V>): GroupedIterable<K, V> {
  return {
    [Symbol.iterator]: function*() {
      for (const x of value) {
        yield x
      }
    },
    key
  }
}

export function _groupBy<T, TKey>(
  src: Iterable<T>,
  keySelector: IndexedSelector<T, TKey>,
  equalityComparer?: EqualityComparer<TKey>
): Iterable<GroupedIterable<TKey, T>> {
  const lookup = _toLookup(src, keySelector, equalityComparer)

  return _select(lookup, ([key, value]) => {
    const returnValue = createGroupedIterable(key, value)
    return returnValue
  })
}
export const groupBy = deferP0(_groupBy)
