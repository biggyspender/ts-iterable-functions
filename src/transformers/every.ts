import { IndexedPredicate } from '../types/IndexedPredicate'
import { _some } from './some'
import { deferP0 } from 'ts-functional-pipe'

export const every = deferP0(_every)

export function _every<T>(src: Iterable<T>, pred: IndexedPredicate<T>): boolean {
  return !_some(src, (item, i) => !pred(item, i))
}
