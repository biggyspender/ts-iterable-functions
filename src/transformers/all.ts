import { IndexedPredicate } from '../types/IndexedPredicate'
import { _some } from './some'
import { deferP0 } from 'ts-functional-pipe'

export function _all<T>(src: Iterable<T>, pred: IndexedPredicate<T>): boolean {
  return !_some(src, (item, i) => !pred(item, i))
}

export const all = deferP0(_all)
