import { IndexedPredicate } from '../types/IndexedPredicate'
import { deferP0 } from 'ts-functional-pipe'
import { _indexed } from './indexed'

export function _first<T>(src: Iterable<T>, pred: IndexedPredicate<T> = (x) => true): T {
  for (const x of _indexed(src)) {
    if (pred(...x)) {
      return x[0]
    }
  }
  throw Error('sequence contains no elements')
}

export const first = deferP0(_first)
