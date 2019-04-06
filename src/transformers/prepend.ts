import { toIterable } from '../helpers/toIterable'
import { deferP0 } from 'ts-functional-pipe'

export function _prepend<T>(src: Iterable<T>, item: T): Iterable<T> {
  return toIterable(function*() {
    yield item
    for (const x of src) {
      yield x
    }
  })
}
export const prepend = deferP0(_prepend)
