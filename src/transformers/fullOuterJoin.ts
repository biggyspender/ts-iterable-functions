import getIdentity from './helpers/getIdentity'
import { IndexedSelector } from '../types/IndexedSelector'
import { _fullOuterGroupJoin, fullOuterGroupJoin } from './fullOuterGroupJoin'
import { deferP0, pipeInto as pp } from 'ts-functional-pipe'
import { defaultIfEmpty } from './defaultIfEmpty'
import { map } from './map'
import { flatMap } from './flatMap'
import { MapFactory } from '../types/MapFactory'

const identity = getIdentity()

export function _fullOuterJoin<T, TRight, TKey, TOut>(
  src: Iterable<T>,
  rightSeq: Iterable<TRight>,
  leftKeySelector: IndexedSelector<T, TKey>,
  rightKeySelector: IndexedSelector<TRight, TKey>,
  selector: (o: T | undefined, v: TRight | undefined, k: TKey) => TOut,
  mapFactory?: MapFactory<TKey>
): Iterable<TOut> {
  return pp(
    src,
    fullOuterGroupJoin(
      rightSeq,
      leftKeySelector,
      rightKeySelector,
      (lft, rgt, i) =>
        pp(
          lft,
          defaultIfEmpty(),
          flatMap((l) =>
            pp(
              rgt,
              defaultIfEmpty(),
              map((r) => selector(l, r, i))
            )
          )
        ),
      mapFactory
    ),
    flatMap(identity)
  )
}

export const fullOuterJoin = deferP0(_fullOuterJoin)
