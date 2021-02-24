import { OrderedIterable } from './helpers/OrderedIterable'
import { comparerBuilder } from 'ts-comparer-builder'
import { deferP0 } from 'ts-functional-pipe'

export function _orderByDescending<T, TCmp>(
  src: Iterable<T>,
  selector: (x: T) => TCmp
): OrderedIterable<T> {
  const builder = comparerBuilder<T>().sortKeyDescending(selector)
  return new OrderedIterable<T>(src, builder)
}
export const orderByDescending = deferP0(_orderByDescending)
