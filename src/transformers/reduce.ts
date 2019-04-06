import { _aggregate } from './aggregate'
import { deferP0 } from 'ts-functional-pipe'

export function _reduce<T, TOut>(
  src: Iterable<T>,
  aggFunc: (prev: TOut, curr: T, idx: number) => TOut,
  seed: TOut
) {
  return _aggregate(src, seed, aggFunc)
}

export const reduce = deferP0(_reduce)
