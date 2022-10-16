import { deferP0 } from 'ts-functional-pipe'
import { toIterable } from '../helpers/toIterable'

export function _reverse<T>(src: Iterable<T>): Iterable<T> {
  return toIterable(function*() {
    const out = [...src].reverse()
    for (const x of out) {
      yield x
    }
  })
}
export const reverse = deferP0(_reverse)
