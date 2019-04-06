import { _skipWhile } from './skipWhile'
import { deferP0 } from 'ts-functional-pipe'

export function _skip<T>(src: Iterable<T>, numItems: number): Iterable<T> {
  return _skipWhile(src, (_, i) => i < numItems)
}

export const skip = deferP0(_skip)
