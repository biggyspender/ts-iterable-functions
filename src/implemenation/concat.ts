import { toIterable } from './toIterable'
import { deferP0 } from 'ts-functional-pipe'

export function _concat<T>(src: Iterable<T>, ...sequences: Array<Iterable<T>>): Iterable<T> {
  return toIterable(function*() {
    for (const item of src) {
      yield item
    }
    for (const seq of sequences) {
      for (const item of seq) {
        yield item
      }
    }
  })
}

export const concat = deferP0(_concat)
