import { deferP0 } from 'ts-functional-pipe'
import { _every } from './every'
import { SetFactory } from '../types/SetFactory'

export function _isSubsetOf<T>(
  src: Iterable<T>,
  seq: Iterable<T>,
  setFactory: SetFactory<T> = { createSet: () => new Set() }
): boolean {
  const set = setFactory.createSet()
  for (const x of seq) {
    set.add(x)
  }
  return _every(src, (x) => set.has(x))
}

export const isSubsetOf = deferP0(_isSubsetOf)
