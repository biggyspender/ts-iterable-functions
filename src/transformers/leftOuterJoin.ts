import { IndexedSelector } from '../types/IndexedSelector'
import { EqualityComparer } from 'ts-equality-comparer'
import { _groupJoin, groupJoin } from './groupJoin'
import { $p, deferP0 } from 'ts-functional-pipe'
import { selectMany } from './selectMany'
import { defaultIfEmpty } from './defaultIfEmpty'
import { select } from './select'

export function _leftOuterJoin<T, TInner, TKey, TOut>(
  src: Iterable<T>,
  innerSeq: Iterable<TInner>,
  outerKeySelector: IndexedSelector<T, TKey>,
  innerKeySelector: IndexedSelector<TInner, TKey>,
  selector: (outer: T, inner: TInner | undefined) => TOut,
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
    selectMany(({ outer, innerSeq }) =>
      $p(innerSeq, defaultIfEmpty(), select(i => selector(outer, i)))
    )
  )
}
export const leftOuterJoin = deferP0(_leftOuterJoin)