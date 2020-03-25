import { fromSingleValue } from '../generators/fromSingleValue'
import { empty } from '../generators/empty'
import { pp } from 'ts-functional-pipe'
import { aggregate } from './aggregate'
import { selectMany } from './selectMany'
import { select } from './select'
import { append } from './append'

export const cartesian = <T>(sequences: Iterable<Iterable<T>>): Iterable<Iterable<T>> => {
  const emptyProduct = fromSingleValue(empty<T>())
  return pp(
    sequences,
    aggregate(emptyProduct, (accumulator, sequence) =>
      pp(accumulator, selectMany(accSeq => pp(sequence, select(item => pp(accSeq, append(item))))))
    )
  )
}
