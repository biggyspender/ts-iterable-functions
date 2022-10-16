import { pipeInto as pp } from 'ts-functional-pipe'
import { empty } from '../generators/empty'
import { fromSingleValue } from '../generators/fromSingleValue'
import { aggregate } from './aggregate'
import { append } from './append'
import { flatMap } from './flatMap'
import { map } from './map'

export const cartesian = <T>(sequences: Iterable<Iterable<T>>): Iterable<Iterable<T>> => {
  const emptyProduct = fromSingleValue(empty<T>())
  return pp(
    sequences,
    aggregate(emptyProduct, (accumulator, sequence) =>
      pp(
        accumulator,
        flatMap((accSeq) =>
          pp(
            sequence,
            map((item) => pp(accSeq, append(item)))
          )
        )
      )
    )
  )
}
