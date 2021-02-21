import { _where } from './where'
import { deferP0 } from 'ts-functional-pipe'
import { SetFactory } from "../types/SetFactory"

export function _except<T>(
  src: Iterable<T>,
  seq: Iterable<T>,
  setFactory: SetFactory<T> = {createSet:() => new Set()}
): Iterable<T> {
  const set: Set<T> = setFactory.createSet()
  for (const item of seq) {
    set.add(item)
  }
  return _where(src, item => !set.has(item))
}

export const except = deferP0(_except)
