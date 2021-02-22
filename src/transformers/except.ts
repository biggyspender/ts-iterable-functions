import { _where } from './where'
import { deferP0 } from 'ts-functional-pipe'
import { SetFactory } from "../types/SetFactory"
import { toIterable } from '../helpers/toIterable'

export function _except<T>(
  src: Iterable<T>,
  seq: Iterable<T>,
  setFactory: SetFactory<T> = { createSet: () => new Set() }
): Iterable<T> {
  return toIterable(function* () {
    const set: Set<T> = setFactory.createSet()
    for (const item of seq) {
      set.add(item)
    }
    const outputValues = _where(src, item => !set.has(item))
    for (const v of outputValues) {
      yield v
    }
  })
}

export const except = deferP0(_except)
