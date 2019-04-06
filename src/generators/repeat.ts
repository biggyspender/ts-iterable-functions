import { $p } from 'ts-functional-pipe'
import { select } from '../transformers/select'
import { range } from './range'
export function repeat<T>(item: T, numRepeats: number): Iterable<T> {
  return $p(range(0, numRepeats), select(() => item))
}
