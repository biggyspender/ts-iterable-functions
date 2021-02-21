import { deferP0 } from 'ts-functional-pipe'
import { SetFactory } from "../types/SetFactory"
import { _isSubsetOf } from './isSubsetOf'

export function _isSupersetOf<T>(
  src: Iterable<T>,
  seq: Iterable<T>,
  setFactory: SetFactory<T> = {createSet:() => new Set()}
): boolean {
  return _isSubsetOf(seq, src, setFactory)
}

export const isSupersetOf = deferP0(_isSupersetOf)
