import { deferP0 } from 'ts-functional-pipe'

export function _forEach<T>(src: Iterable<T>, action: (x: T, i: number) => void): void {
  let i = 0
  for (const x of src) {
    const currentIdx = i++
    action(x, currentIdx)
  }
}

export const forEach = deferP0(_forEach)
