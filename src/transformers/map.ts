import { IndexedSelector } from '../types/IndexedSelector'
import { toIterable } from '../helpers/toIterable'
import { deferP0 } from 'ts-functional-pipe'

export function _map<T, TOut>(
  src: Iterable<T>,
  selector: IndexedSelector<T, TOut>
): Iterable<TOut> {
  return toIterable(function* () {
    let c = 0
    for (const x of src) {
      yield selector(x, c++)
    }
  })
}

export const map = deferP0(_map)
