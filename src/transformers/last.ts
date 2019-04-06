import { IndexedPredicate } from '../types/IndexedPredicate'
import { deferP0 } from 'ts-functional-pipe'

const dummy: any = {}
export function _last<T>(src: Iterable<T>, pred: IndexedPredicate<T> = () => true): T {
  let i = 0
  let returnVal = dummy
  let found = false
  for (const item of src) {
    if (pred(item, i++)) {
      returnVal = item
      found = true
    }
  }
  if (found) {
    return returnVal
  } else {
    throw Error('sequence contains no elements')
  }
}
export const last = deferP0(_last)
