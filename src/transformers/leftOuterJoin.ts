import { IndexedSelector } from '../types/IndexedSelector'
import { _groupJoin, groupJoin } from './groupJoin'
import { pp, deferP0 } from 'ts-functional-pipe'
import { selectMany } from './selectMany'
import { defaultIfEmpty } from './defaultIfEmpty'
import { select } from './select'
import { MapFactory } from "../types/MapFactory"

export function _leftOuterJoin<T, TInner, TKey, TOut>(
  src: Iterable<T>,
  innerSeq: Iterable<TInner>,
  outerKeySelector: IndexedSelector<T, TKey>,
  innerKeySelector: IndexedSelector<TInner, TKey>,
  selector: (outer: T, inner: TInner | undefined) => TOut,
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
    selectMany(({ outer, innerSeq }) =>
      pp(innerSeq, defaultIfEmpty(), select(i => selector(outer, i)))
    )
  )
}
export const leftOuterJoin = deferP0(_leftOuterJoin)
