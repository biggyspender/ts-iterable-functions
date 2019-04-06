import getIdentity from './helpers/getIdentity'
import { defaultComparer, Comparer } from 'ts-comparer-builder'
import { IndexedSelector } from '../types/IndexedSelector'
import { minMaxByImpl } from './helpers/minMaxByImpl'
import { _select, select } from './select'
import { _firstOrDefault, firstOrDefault } from './firstOrDefault'
import { pipeValue, deferP0 } from 'ts-functional-pipe'

const identity = getIdentity()

export function _min<T, TOut>(
  src: Iterable<T>,
  selector: IndexedSelector<T, T | TOut> = identity,
  comparer: Comparer<T | TOut> = defaultComparer
): T | TOut | undefined {
  return pipeValue(src).into(
    select(selector),
    minMaxByImpl(x => x, (a, b) => -comparer(a, b)),
    firstOrDefault()
  )
}

export const min = deferP0(_min)
