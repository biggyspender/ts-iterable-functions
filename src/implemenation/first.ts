import { IndexedPredicate } from '../types/IndexedPredicate'
import { deferP0 } from 'ts-functional-pipe'

export function _first<T>(src: Iterable<T>, pred: IndexedPredicate<T> = x => true): T {
  let i = 0
  for (const item of src) {
    if (pred(item, i++)) {
      return item
    }
  }
  throw Error('sequence contains no elements')
}

export const first = deferP0(_first)
