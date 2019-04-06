import { deferP0 } from 'ts-functional-pipe'

export function _toArray<T>(src: Iterable<T>): T[] {
  return [...src]
}
export const toArray = deferP0(_toArray)
