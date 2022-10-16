import { deferP0 } from 'ts-functional-pipe'
import { _aggregate } from './aggregate'

/**
 * calculates the average value of a sequence of **`number`**
 * @param src a sequence of numbers
 */
export function _average(src: Iterable<number>): number {
  const f = _aggregate(
    src,
    {
      tot: 0,
      count: 0,
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

/**
 * calculates the average value of a sequence of **`number`**
 * @remarks
 * {@link https://biggyspender.github.io/ts-functional-pipe/globals.html#deferp0 P0 deferred} version of {@link _average}
 * @param src a sequence of numbers
 */

export const average = deferP0(_average)
