import { toIterable } from './toIterable'
import { deferP0 } from 'ts-functional-pipe'

export function _zip<T, TOther, TOut>(
  src: Iterable<T>,
  seq: Iterable<TOther>,
  selector: (item1: T, item2: TOther) => TOut
): Iterable<TOut> {
  return toIterable(function*() {
    const it1 = src[Symbol.iterator]()
    const it2 = seq[Symbol.iterator]()

    for (;;) {
      const it1Result = it1.next()
      const it2Result = it2.next()

      if (it1Result.done || it2Result.done) {
        break
      }
      yield selector(it1Result.value, it2Result.value)
    }
  })
}
export const zip = deferP0(_zip)
