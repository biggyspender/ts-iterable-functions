import { deferP0 } from 'ts-functional-pipe'
import { _flatMap } from './flatMap'

export function _flatten<T>(src: Iterable<Iterable<T>>): Iterable<T> {
  return _flatMap(src, (x) => x)
}

export const flatten = deferP0(_flatten)
