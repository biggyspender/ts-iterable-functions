import { toIterable } from './toIterable'
import { IndexedPredicate } from '../types/IndexedPredicate'
import { deferP0 } from 'ts-functional-pipe'

export function _where<T>(src: Iterable<T>, pred: IndexedPredicate<T>): Iterable<T> {
  return toIterable(function*() {
    let i = 0
    for (const x of src) {
      if (pred(x, i++)) {
        yield x
      }
    }
  })
}

export const where = deferP0(_where)
