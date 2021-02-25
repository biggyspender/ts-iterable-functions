import { toIterable } from './toIterable'

export const headTail = <T>(src: Iterable<T>): readonly [T, Iterable<T>] => {
  const iter = src[Symbol.iterator]()
  const n = iter.next()
  if (n.done) {
    throw Error('sequence is empty')
  } else {
    return [
      n.value,
      toIterable(function* () {
        let next: IteratorResult<T>
        while (!(next = iter.next()).done) {
          yield next.value
        }
      }),
    ]
  }
}
