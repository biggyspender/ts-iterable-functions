import { IndexedSelector } from '../types/IndexedSelector'
import { EqualityComparer } from 'ts-equality-comparer'
import { $p, deferP0 } from 'ts-functional-pipe'
import { groupJoin } from './groupJoin'
import { selectMany } from './selectMany'
import { _select } from './select'

export function _join<T, TInner, TKey, TOut>(
  src: Iterable<T>,
  innerSeq: Iterable<TInner>,
  outerKeySelector: IndexedSelector<T, TKey>,
  innerKeySelector: IndexedSelector<TInner, TKey>,
  selector: (outer: T, inner: TInner) => TOut,
  equalityComparer?: EqualityComparer<TKey>
): Iterable<TOut> {
  return $p(
    src,
    groupJoin(
      innerSeq,
      outerKeySelector,
      innerKeySelector,
      (outer, innerSeq) => ({
        outer,
        innerSeq
      }),
      equalityComparer
    ),
    selectMany(({ outer, innerSeq }) => _select(innerSeq, i => selector(outer, i)))
  )
}
export const join = deferP0(_join)
