import { EqualityComparer } from 'ts-equality-comparer'
import { createComparerSet } from 'ts-hashmap'
import { deferP0 } from 'ts-functional-pipe'
import { _all } from './all'

export function _isSubsetOf<T>(
  src: Iterable<T>,
  seq: Iterable<T>,
  equalityComparer?: EqualityComparer<T>
): boolean {
  const set = createComparerSet(equalityComparer)
  for (const x of seq) {
    set.add(x)
  }
  return _all(src, x => set.has(x))
}

export const isSubsetOf = deferP0(_isSubsetOf)
