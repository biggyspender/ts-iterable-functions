import { IndexedPredicate } from '../types/IndexedPredicate'
import { deferP0 } from 'ts-functional-pipe'

export function _lastOrDefault<T>(
  src: Iterable<T>,
  pred: IndexedPredicate<T> = x => true
): T | undefined {
  let i = 0
  let returnVal
  for (const item of src) {
    if (pred(item, i++)) {
      returnVal = item
    }
  }
  return returnVal
}

export const lastOrDefault = deferP0(_lastOrDefault)
