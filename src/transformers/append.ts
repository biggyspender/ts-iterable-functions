import { deferP0 } from 'ts-functional-pipe'
import { toIterable } from '../helpers/toIterable'

export function _append<T>(src: Iterable<T>, item: T): Iterable<T> {
  return toIterable(function*() {
    for (const x of src) {
      yield x
    }
    yield item
  })
}

export const append = deferP0(_append)
