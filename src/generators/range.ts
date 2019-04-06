import { toIterable } from '../helpers/toIterable'
export function range(start: number, range: number): Iterable<number> {
  if (Math.trunc(start) !== start) {
    throw Error('start must be an integral value')
  }
  if (Math.trunc(range) !== range) {
    throw Error('range must be an integral value')
  }
  if (range < 0) {
    throw Error('range must be >= 0')
  }
  return toIterable(function*() {
    for (let i = 0; i < range; ++i) {
      yield i + start
    }
  })
}
