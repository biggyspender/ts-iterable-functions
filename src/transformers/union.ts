import { $p, deferP0 } from 'ts-functional-pipe'
import { concat } from './concat'
import { distinct } from './distinct'
import { EqualityComparer } from 'ts-equality-comparer'

export function _union<T>(
  src: Iterable<T>,
  seq: Iterable<T>,
  equalityComparer?: EqualityComparer<T>
): Iterable<T> {
  return $p(src, concat(seq), distinct(equalityComparer))
}
export const union = deferP0(_union)
