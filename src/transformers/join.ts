import { IndexedSelector } from '../types/IndexedSelector'
import { pp, deferP0 } from 'ts-functional-pipe'
import { groupJoin } from './groupJoin'
import { selectMany } from './selectMany'
import { _select } from './select'
import { MapFactory } from "../types/MapFactory"

export function _join<T, TInner, TKey, TOut>(
  src: Iterable<T>,
  innerSeq: Iterable<TInner>,
  outerKeySelector: IndexedSelector<T, TKey>,
  innerKeySelector: IndexedSelector<TInner, TKey>,
  selector: (outer: T, inner: TInner) => TOut,
  mapFactory?: MapFactory<TKey>
): Iterable<TOut> {
  return pp(
    src,
    groupJoin(
      innerSeq,
      outerKeySelector,
      innerKeySelector,
      (outer, innerSeq) => ({
        outer,
        innerSeq
      }),
      mapFactory
    ),
    selectMany(({ outer, innerSeq }) => _select(innerSeq, i => selector(outer, i)))
  )
}
export const join = deferP0(_join)
