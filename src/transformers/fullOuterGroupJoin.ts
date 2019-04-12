import { IndexedSelector } from '../types/IndexedSelector'
import { EqualityComparer } from 'ts-equality-comparer'
import { _toLookup } from './toLookup'
import { deferP0, pp } from 'ts-functional-pipe'
import { select, _select } from './select'
import { distinct } from './distinct'
import { concat } from './concat'

export function _fullOuterGroupJoin<T, TRight, TKey, TOut>(
  src: Iterable<T>,
  rightSeq: Iterable<TRight>,
  leftKeySelector: IndexedSelector<T, TKey>,
  rightKeySelector: IndexedSelector<TRight, TKey>,
  selector: (o: Iterable<T>, v: Iterable<TRight>, k: TKey) => TOut,
  equalityComparer?: EqualityComparer<TKey>
): Iterable<TOut> {
  const right = rightSeq
  const leftLookup = _toLookup(src, leftKeySelector, equalityComparer)
  const rightLookup = _toLookup(right, rightKeySelector, equalityComparer)
  const rightLookupKeys = _select(rightLookup, ([key, _]) => key)
  const allKeys = pp(leftLookup, select(([key, _]) => key), concat(rightLookupKeys), distinct())

  return pp(
    allKeys,
    select(key => ({ key, leftItem: leftLookup.get(key) || [] })),
    select(({ key, leftItem }) => ({
      key,
      leftItem,
      rightItem: rightLookup.get(key) || []
    })),
    select(x => selector(x.leftItem, x.rightItem, x.key))
  )
}

export const fullOuterGroupJoin = deferP0(_fullOuterGroupJoin)
