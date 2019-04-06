import { EqualityComparer } from 'ts-equality-comparer'
import { deferP0 } from 'ts-functional-pipe'
import { _distinctBy } from './distinctBy'

export function _distinct<T>(
  src: Iterable<T>,
  equalityComparer?: EqualityComparer<T>
): Iterable<T> {
  return _distinctBy(src, x => x, equalityComparer)
}

export const distinct = deferP0(_distinct)
