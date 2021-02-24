import { _flatMap } from './flatMap'
import { deferP0 } from 'ts-functional-pipe'

export function _flatten<T>(src: Iterable<Iterable<T>>): Iterable<T> {
  return _flatMap(src, (x) => x)
}

export const flatten = deferP0(_flatten)
