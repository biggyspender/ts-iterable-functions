import { deferP0 } from 'ts-functional-pipe';
import { Indexed } from '../types/Indexed';
import { _select } from './select';


export function _indexed<T>(src: Iterable<T>): Iterable<Indexed<T>> {
  return _select(src, (x, i) => ({ value: x, index: i }));
}
export const indexed = deferP0(_indexed);
