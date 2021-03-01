import { deferP0 } from 'ts-functional-pipe'

export function* _zipAllToTuple<T extends readonly any[]>(src: Iterablified<T>): Iterable<T> {
  const iterators = (src.map((iterable) =>
    iterable[Symbol.iterator]()
  ) as unknown) as Iteratorfied<T>
  for (;;) {
    const itRes = (iterators.map((it) => it.next()) as unknown) as IteratorResultified<T>
    if (itRes.some((r) => r.done)) {
      break
    }
    const v = (itRes.map((r) => r.value) as unknown) as T
    yield v
  }
}

export const zipAllToTuple = deferP0(_zipAllToTuple)

type Iterablified<T extends readonly any[]> = {
  [P in keyof T]: Iterable<T[P]>
}
type Iteratorfied<T extends readonly any[]> = {
  [P in keyof T]: Iterator<T[P]>
}
type IteratorResultified<T extends readonly any[]> = {
  [P in keyof T]: IteratorResult<T[P]>
}
