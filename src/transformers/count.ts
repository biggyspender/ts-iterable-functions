import { IndexedPredicate } from '../types/IndexedPredicate'
import { deferP0 } from 'ts-functional-pipe'

export function _count<T>(src: Iterable<T>, pred: IndexedPredicate<T> = x => true): number {
  let c = 0
  let i = 0
  for (const item of src) {
    if (pred(item, i++)) {
      ++c
    }
  }
  return c
}

export const count = deferP0(_count)
