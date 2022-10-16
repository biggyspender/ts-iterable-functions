import { pipeInto as pp, deferP0 } from 'ts-functional-pipe'
import { SetFactory } from '../types/SetFactory'
import { concat } from './concat'
import { distinct } from './distinct'
export function _union<T>(
  src: Iterable<T>,
  seq: Iterable<T>,
  setFactory?: SetFactory<T>
): Iterable<T> {
  return pp(src, concat(seq), distinct(setFactory))
}
export const union = deferP0(_union)
