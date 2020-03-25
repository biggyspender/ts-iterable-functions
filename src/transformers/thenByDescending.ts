import OrderedIterable from './helpers/OrderedIterable'
import { deferP0 } from 'ts-functional-pipe'
import { memoize } from './helpers/memoize'
export function _thenByDescending<T, TCmp>(
  src: OrderedIterable<T>,
  selector: (x: T) => TCmp
): OrderedIterable<T> {
  return src.createNewFrom(builder => builder.thenKeyDescending(memoize(selector)))
}
export const thenByDescending = deferP0(_thenByDescending)
