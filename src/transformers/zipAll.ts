import { _aggregate } from './aggregate'
import { _zip } from './zip'
import { _append } from './append'
import { _map } from './map'
import { deferP0 } from 'ts-functional-pipe'

export function _zipAll<TT>(src: Iterable<Iterable<TT>>): Iterable<Iterable<TT>> {
  const v = _aggregate<Iterable<TT>, Iterable<Iterable<TT>> | undefined>(
    src,
    undefined,
    (acc, curr) =>
      typeof acc === 'undefined' ? _map(curr, (x) => [x]) : _zip(acc, curr, (a, c) => _append(a, c))
  )
  /* istanbul ignore next */
  return typeof v === 'undefined' ? [] : v
}
export const zipAll = deferP0(_zipAll)
