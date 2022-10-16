import { pipeInto as pp } from 'ts-functional-pipe'
import { reduce } from './reduce'
import { reverse } from './reverse'
export function _reduceRight<T, TOut>(
  src: Iterable<T>,
  aggFunc: (prev: TOut, curr: T, idx: number) => TOut,
  seed: TOut
): TOut
export function _reduceRight<T>(src: Iterable<T>, aggFunc: (prev: T, curr: T, idx: number) => T): T
export function _reduceRight<T, TOut, TT extends T | TOut>(
  src: Iterable<T>,
  aggFunc: (prev: TT, curr: T, idx: number) => TT,
  seed?: TT
): TT {
  return pp(src, reverse(), reduce(aggFunc, seed as TT))
}

export function reduceRight<T, TOut>(
  aggFunc: (prev: TOut, curr: T, idx: number) => TOut,
  seed: TOut
): (source: Iterable<T>) => TOut
export function reduceRight<T>(
  aggFunc: (prev: T, curr: T, idx: number) => T
): (source: Iterable<T>) => T
export function reduceRight<T, TOut, TT extends T | TOut>(
  aggFunc: (prev: TT, curr: T, idx: number) => TT,
  seed?: TT
): (source: Iterable<T>) => TT {
  return (source: Iterable<T>) => _reduceRight(source, aggFunc, seed as TT)
}
