import { deferP0 } from 'ts-functional-pipe'
import { toIterable } from '../helpers/toIterable'

/**
 * concatenate any number of sequences to the end of a sequence
 * @param src the source sequence
 * @param sequences additional sequences whose items will be appended to the output sequence
 * @example concat(src, seq1, seq2, seq3)
 */
export function _concat<T>(src: Iterable<T>, ...sequences: Iterable<T>[]): Iterable<T> {
  return toIterable(function* () {
    for (const item of src) {
      yield item
    }
    for (const seq of sequences) {
      for (const item of seq) {
        yield item
      }
    }
  })
}

/**
 * concatenate any number of sequences to the end of a sequence
 * @remarks
 * {@link https://biggyspender.github.io/ts-functional-pipe/globals.html#deferp0 P0 deferred} version of {@link _concat}
 * @param src the source sequence
 * @param args additional sequences whose items will be appended to the output sequence
 * @example concat(seq1, seq2, seq3)
 */
export const concat = deferP0(_concat)
