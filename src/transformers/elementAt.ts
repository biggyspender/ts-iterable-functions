import { _single } from './single'
import { deferP0 } from 'ts-functional-pipe'

export function _elementAt<T>(src: Iterable<T>, index: number): T {
  return _single(src, (_, i) => i === index)
}

export const elementAt = deferP0(_elementAt)
