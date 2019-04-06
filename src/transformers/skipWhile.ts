import { IndexedPredicate } from '../types/IndexedPredicate'
import { toIterable } from './toIterable'
import { deferP0 } from 'ts-functional-pipe'

export function _skipWhile<T>(src: Iterable<T>, pred: IndexedPredicate<T>): Iterable<T> {
  return toIterable(function*() {
    let i = 0
    for (const item of src) {
      const result = pred(item, i++)
      if (result) {
        continue
      }
      yield item
    }
  })
}
export const skipWhile = deferP0(_skipWhile)
