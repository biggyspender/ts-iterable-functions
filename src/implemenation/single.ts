import { IndexedPredicate } from '../types/IndexedPredicate'
import { deferP0 } from 'ts-functional-pipe'

const dummy: any = {}

export function _single<T>(src: Iterable<T>, pred: IndexedPredicate<T> = x => true): T {
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
  throw Error('sequence contains no elements')
}

export const single = deferP0(_single)
