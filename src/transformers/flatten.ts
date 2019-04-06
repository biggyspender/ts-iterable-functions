import { _selectMany } from './selectMany'
import { deferP0 } from 'ts-functional-pipe'

export function _flatten<T>(src: Iterable<Iterable<T>>): Iterable<T> {
  return _selectMany(src, x => x)
}

export const flatten = deferP0(_flatten)
