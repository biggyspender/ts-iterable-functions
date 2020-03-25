import OrderedIterable from './helpers/OrderedIterable'
import { comparerBuilder } from 'ts-comparer-builder'
import { deferP0 } from 'ts-functional-pipe'
import { memoize } from './helpers/memoize'

export function _orderByDescending<T, TCmp>(
  src: Iterable<T>,
  selector: (x: T) => TCmp
): OrderedIterable<T> {
  const builder = comparerBuilder<T>().sortKeyDescending(memoize(selector))
  return new OrderedIterable<T>(src, builder)
}
export const orderByDescending = deferP0(_orderByDescending)
