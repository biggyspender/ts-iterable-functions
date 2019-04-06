import { IndexedSelector } from '../types/IndexedSelector'
import { toIterable } from './toIterable'
import { deferP0 } from 'ts-functional-pipe'

export function _selectMany<T, TOut>(
  src: Iterable<T>,
  selector: IndexedSelector<T, Iterable<TOut>>
): Iterable<TOut> {
  return toIterable(function*() {
    let i = 0
    for (const seq of src) {
      for (const item of selector(seq, i++)) {
        yield item
      }
    }
  })
}
export const selectMany = deferP0(_selectMany)
