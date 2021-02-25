import { IndexedPredicate } from '../types/IndexedPredicate'
import { _some } from './some'
import { deferP0 } from 'ts-functional-pipe'

/**
 * returns `true` if *all* elements in `src` return `true` when passed to `pred`
 * @remarks
 * {@link https://biggyspender.github.io/ts-functional-pipe/globals.html#deferp0 P0 deferred} version of {@link _every}
 * @param src source sequence
 * @param pred indexed predicate function
 */
export const every = deferP0(_every)

/**
 * returns `true` if *all* elements in `src` return `true` when passed to `pred`
 *
 * @param src source sequence
 * @param pred indexed predicate function
 */
export function _every<T>(src: Iterable<T>, pred: IndexedPredicate<T>): boolean {
  return !_some(src, (item, i) => !pred(item, i))
}
