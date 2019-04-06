import { _aggregate } from './aggregate'
import { deferP0 } from 'ts-functional-pipe'

export function _average(src: Iterable<number>): number {
  const f = _aggregate(
    src,
    {
      tot: 0,
      count: 0
    },
    (acc, val) => {
      acc.tot += val
      acc.count++
      return acc
    }
  )
  if (f.count === 0) {
    throw Error('sequence contains no elements')
  }
  return f.tot / f.count
}

export const average = deferP0(_average)
