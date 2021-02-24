import { deferP0 } from 'ts-functional-pipe'
import { Indexed } from '../types/Indexed'
import { _map } from './map'

export function _indexed<T>(src: Iterable<T>): Iterable<Indexed<T>> {
  return _map(src, (x, i) => [x, i] as const)
}
export const indexed = deferP0(_indexed)
