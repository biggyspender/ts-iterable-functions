import { EqualityComparer } from 'ts-equality-comparer'
import { createComparerSet } from 'ts-hashmap'
import { _where } from './where'
import { deferP0 } from 'ts-functional-pipe'

export function _intersect<T>(
  src: Iterable<T>,
  seq: Iterable<T>,
  equalityComparer?: EqualityComparer<T>
): Iterable<T> {
  const set: Set<T> = createComparerSet(equalityComparer)
  for (const item of seq) {
    set.add(item)
  }
  return _where(src, item => set.has(item))
}

export const intersect = deferP0(_intersect)
