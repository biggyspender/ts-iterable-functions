import { OrderedIterable } from './helpers/OrderedIterable'
import { deferP0 } from 'ts-functional-pipe'

export function _thenBy<T, TCmp>(
  src: OrderedIterable<T>,
  selector: (x: T) => TCmp
): OrderedIterable<T> {
  return src.createNewFrom(builder => builder.thenKey(selector))
}
export const thenBy = deferP0(_thenBy)
