import { _aggregate } from './aggregate'
import { deferP0 } from 'ts-functional-pipe'

export function _sum(src: Iterable<number>): number {
  return _aggregate(src, 0, (acc, val) => acc + val)
}

export const sum = deferP0(_sum)
