import { deferP0, pp } from 'ts-functional-pipe';
import { orderBy } from './orderBy';
import { select } from './select';
import { Indexed } from "../types/Indexed";


export function _unwrapIndexed<T>(src: Iterable<Indexed<T>>): Iterable<T> {
  return pp(src, orderBy(({ value }) => value), select(({ value }) => value));
}

export const unwrapIndexed = deferP0(_unwrapIndexed);
