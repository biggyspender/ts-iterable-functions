import { IndexedPredicate } from '../types/IndexedPredicate'
import { deferP0 } from 'ts-functional-pipe'

export function _some<T>(src: Iterable<T>, pred: IndexedPredicate<T> = (x) => true): boolean {
  let i = 0
  for (const item of src) {
    if (pred(item, i++)) {
      return true
    }
  }
  return false
}

export const some = deferP0(_some)
