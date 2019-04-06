import { _minMaxByImpl } from './helpers/minMaxByImpl'
import { Comparer, defaultComparer } from 'ts-comparer-builder'
import { IndexedSelector } from '../types/IndexedSelector'
import { deferP0 } from 'ts-functional-pipe'

export function _minBy<T, TKey>(
  src: Iterable<T>,
  selector: IndexedSelector<T, TKey>,
  comparer: Comparer<TKey> = defaultComparer
): Iterable<T> {
  return _minMaxByImpl(src, selector, (a, b) => -comparer(a, b))
}

export const minBy = deferP0(_minBy)
