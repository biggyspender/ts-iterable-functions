import OrderedIterable from './helpers/OrderedIterable'
import { deferP0 } from 'ts-functional-pipe'
import { memoize } from './helpers/memoize'

export function _thenBy<T, TCmp>(
  src: OrderedIterable<T>,
  selector: (x: T) => TCmp
): OrderedIterable<T> {
  return src.createNewFrom(builder => builder.thenKey(memoize(selector)))
}
export const thenBy = deferP0(_thenBy)
