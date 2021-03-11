import { pipeInto as pp } from 'ts-functional-pipe'
import { map } from '../transformers/map'
import { range } from './range'
export function repeatGenerate<T>(generator: (i: number) => T, numRepeats: number): Iterable<T> {
  return pp(
    range(0, numRepeats),
    map((i) => generator(i))
  )
}
