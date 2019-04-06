import { IndexedSelector } from '../types/IndexedSelector'
import { EqualityComparer } from 'ts-equality-comparer'
import { toIterable } from './toIterable'
import { createComparerSet } from 'ts-hashmap'
import { deferP0 } from 'ts-functional-pipe'

export function _distinctBy<T, TKey>(
  src: Iterable<T>,
  selector: IndexedSelector<T, TKey>,
  equalityComparer?: EqualityComparer<TKey>
): Iterable<T> {
  return toIterable(function*() {
    const set = createComparerSet<TKey>(equalityComparer)
    let i = 0
    for (const x of src) {
      const idx = i++
      const key = selector(x, idx)
      if (set.has(key)) {
        continue
      }
      set.add(key)
      yield x
    }
  })
}

export const distinctBy = deferP0(_distinctBy)
