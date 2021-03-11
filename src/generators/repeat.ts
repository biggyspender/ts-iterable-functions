import { pipeInto as pp } from 'ts-functional-pipe'
import { map } from '../transformers/map'
import { range } from './range'
export function repeat<T>(item: T, numRepeats: number): Iterable<T> {
  return pp(
    range(0, numRepeats),
    map(() => item)
  )
}
