import getIdentity from './helpers/getIdentity'
import { defaultComparer, Comparer } from 'ts-comparer-builder'
import { IndexedSelector } from '../types/IndexedSelector'
import { minMaxByImpl } from './helpers/minMaxByImpl'
import { map } from './map'
import { first } from './first'
import { pipeInto as pp, deferP0 } from 'ts-functional-pipe'

export function _min<T, TOut = T>(
  src: Iterable<T>,
  selector: IndexedSelector<T, TOut> = (x) => (x as unknown) as TOut,
  comparer: Comparer<TOut> = defaultComparer
): TOut | undefined {
  return pp(
    src,
    map(selector),
    minMaxByImpl(
      (x) => x,
      (a, b) => -comparer(a, b)
    ),
    first()
  )
}

export const min = deferP0(_min)
