import OrderedIterable from './helpers/OrderedIterable'
import { deferP0 } from 'ts-functional-pipe'
import { _thenBy } from './thenBy'
export function _thenByDescending<T, TCmp>(
  src: OrderedIterable<T>,
  selector: (x: T) => TCmp
): OrderedIterable<T> {
  const newBuilder = src.comparerBuilder.thenKeyDescending(selector)
  return src.createNewFrom(newBuilder)
}
export const thenByDescending = deferP0(_thenBy)
