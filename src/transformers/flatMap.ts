import { deferP0 } from 'ts-functional-pipe'
import { toIterable } from '../helpers/toIterable'
import { IndexedSelector } from '../types/IndexedSelector'

export const flatMap = deferP0(_flatMap)

export function _flatMap<T, TOut>(
  src: Iterable<T>,
  selector: IndexedSelector<T, Iterable<TOut>>
): Iterable<TOut> {
  return toIterable(function* () {
    let i = 0
    for (const seq of src) {
      for (const item of selector(seq, i++)) {
        yield item
      }
    }
  })
}
