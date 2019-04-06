import getIdentity from './helpers/getIdentity'
import { IndexedSelector } from '../types/IndexedSelector'
import { EqualityComparer } from 'ts-equality-comparer'
import { _fullOuterGroupJoin, fullOuterGroupJoin } from './fullOuterGroupJoin'
import { deferP0, $p } from 'ts-functional-pipe'
import { defaultIfEmpty } from './defaultIfEmpty'
import { select } from './select'
import { selectMany } from './selectMany'

const identity = getIdentity()

export function _fullOuterJoin<T, TRight, TKey, TOut>(
  src: Iterable<T>,
  rightSeq: Iterable<TRight>,
  leftKeySelector: IndexedSelector<T, TKey>,
  rightKeySelector: IndexedSelector<TRight, TKey>,
  selector: (o: T | undefined, v: TRight | undefined, k: TKey) => TOut,
  equalityComparer?: EqualityComparer<TKey>
): Iterable<TOut> {
  return $p(
    src,
    fullOuterGroupJoin(
      rightSeq,
      leftKeySelector,
      rightKeySelector,
      (lft, rgt, i) =>
        $p(
          lft,
          defaultIfEmpty(),
          selectMany(l => $p(rgt, defaultIfEmpty(), select(r => selector(l, r, i))))
        ),
      equalityComparer
    ),
    selectMany(identity)
  )
}

export const fullOuterJoin = deferP0(_fullOuterJoin)
