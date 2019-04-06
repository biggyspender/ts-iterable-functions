import { EqualityComparer } from 'ts-equality-comparer'
import { deferP0 } from 'ts-functional-pipe'
import { _isSubsetOf } from './isSubsetOf'

export function _isSupersetOf<T>(
  src: Iterable<T>,
  seq: Iterable<T>,
  equalityComparer?: EqualityComparer<T>
): boolean {
  return _isSubsetOf(seq, src, equalityComparer)
}

export const isSupersetOf = deferP0(_isSupersetOf)
