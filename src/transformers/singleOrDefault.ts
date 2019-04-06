import { IndexedPredicate } from '../types/IndexedPredicate'
import { deferP0 } from 'ts-functional-pipe'

const dummy: any = {}

export function _singleOrDefault<T>(
  src: Iterable<T>,
  pred: IndexedPredicate<T> = x => true
): T | undefined {
  let itemCount = 0
  let foundItem = dummy
  let i = 0
  for (const item of src) {
    if (pred(item, i++)) {
      ++itemCount
      if (itemCount > 1) {
        throw Error('sequence contains more than one element')
      }
      foundItem = item
    }
  }
  if (itemCount === 1) {
    return foundItem
  }
  return undefined
}
export const singleOrDefault = deferP0(_singleOrDefault)
