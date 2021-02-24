import { toIterable } from '../helpers/toIterable'
import { IndexedPredicate } from '../types/IndexedPredicate'
import { deferP0 } from 'ts-functional-pipe'

export function _filter<T>(src: Iterable<T>, pred: IndexedPredicate<T>): Iterable<T> {
  return toIterable(function* () {
    let i = 0
    for (const x of src) {
      if (pred(x, i++)) {
        yield x
      }
    }
  })
}

export const filter = deferP0(_filter)
