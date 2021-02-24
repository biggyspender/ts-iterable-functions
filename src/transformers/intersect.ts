import { _filter } from './filter'
import { deferP0 } from 'ts-functional-pipe'
import { SetFactory } from '../types/SetFactory'
import { toIterable } from '../helpers/toIterable'

export function _intersect<T>(
  src: Iterable<T>,
  seq: Iterable<T>,
  setFactory: SetFactory<T> = { createSet: () => new Set() }
): Iterable<T> {
  return toIterable(function* () {
    const set: Set<T> = setFactory.createSet()
    for (const item of seq) {
      set.add(item)
    }
    for (const item of src) {
      if (set.has(item)) {
        yield item
      }
    }
  })
}

export const intersect = deferP0(_intersect)
