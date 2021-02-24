import { deferP0 } from 'ts-functional-pipe'
import { _distinctBy } from './distinctBy'
import { SetFactory } from '../types/SetFactory'

export function _distinct<T>(
  src: Iterable<T>,
  setFactory?: SetFactory<T>
): Iterable<T> {
  return _distinctBy(src, x => x, setFactory)
}

export const distinct = deferP0(_distinct)
