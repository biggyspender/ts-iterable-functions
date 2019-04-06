import { toIterable } from './toIterable'
import { deferP0 } from 'ts-functional-pipe'

export function _defaultIfEmpty<T>(src: Iterable<T>): Iterable<T | undefined> {
  return toIterable<T | undefined, () => IterableIterator<T | undefined>>(function*() {
    let yielded = false
    for (const x of src) {
      yield x
      yielded = true
    }
    if (!yielded) {
      yield undefined
    }
  })
}
export const defaultIfEmpty = deferP0(_defaultIfEmpty)