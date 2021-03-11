import { deferP0, pipeInto as pp } from 'ts-functional-pipe'
import { map } from './map'
import { Iterablified, zipAllToTuple } from './zipAllToTuple'

export function _zipMap<T extends readonly any[], TOut>(
  src: Iterablified<T>,
  selector: (...args: T) => TOut
): Iterable<TOut> {
  return pp(
    src,
    zipAllToTuple(),
    map((args) => selector(...args))
  )
}

export const zipMap = deferP0(_zipMap)
