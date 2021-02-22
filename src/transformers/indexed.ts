import { deferP0 } from 'ts-functional-pipe';
import { _select } from './select';


export interface Indexed<T> {
  value: T;
  index: number;
}
export function _indexed<T>(src: Iterable<T>): Iterable<Indexed<T>> {
  return _select(src, (x, i) => ({ value: x, index: i }));
}
export const indexed = deferP0(_indexed);

export function _unwrapIndexed<T>(src:Iterable<Indexed<T>>):Iterable<T>{
  return _select(src, ({value}) => value);
}

export const unwrapIndexed = deferP0(_unwrapIndexed);

