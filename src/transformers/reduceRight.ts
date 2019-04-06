import { aggregate } from './aggregate'
import { deferP0, $p } from 'ts-functional-pipe'
import { reverse } from './reverse'
export function _reduceRight<T, TOut>(
  src: Iterable<T>,
  aggFunc: (prev: TOut, curr: T, idx: number) => TOut,
  seed: TOut
) {
  return $p(src, reverse(), aggregate(seed, aggFunc))
}
export const reduceRight = deferP0(_reduceRight)
