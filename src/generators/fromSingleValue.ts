import { toIterable } from '../helpers/toIterable'

export const fromSingleValue = <T>(item: T): Iterable<T> =>
  toIterable(function*() {
    yield item
  })
