import { deferP0 } from 'ts-functional-pipe'
import { toIterable } from '../helpers/toIterable'
import { IndexedPredicate } from '../types/IndexedPredicate'
import { _indexed } from './indexed'

/**
 * creates a new sequence with every item of the source sequence for which the predicate function returns `true`
 * @param src source sequence
 * @param pred a function that returns `true` to signal inclusion, `false` to exclude
 * @returns a new (possibly shorter) sequence with some items filtered away
 */
export function _filter<T>(src: Iterable<T>, pred: IndexedPredicate<T>): Iterable<T> {
  return toIterable(function* () {
    const s = _indexed(src)
    for (const x of s) {
      if (pred(...x)) {
        yield x[0]
      }
    }
  })
}

/**
 * creates a new sequence with every item of the source sequence for which the predicate function returns `true`
 *
 * @remarks
 * {@link https://biggyspender.github.io/ts-functional-pipe/globals.html#deferp0 P0 deferred} version of {@link _filter}
 *
 * @param src source sequence
 * @param pred a function that returns `true` to signal inclusion, `false` to exclude
 * @returns a new (possibly shorter) sequence with some items filtered away
 */
export const filter = deferP0(_filter)
