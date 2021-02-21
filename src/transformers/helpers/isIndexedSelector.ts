import { IndexedSelector } from '../../types/IndexedSelector'

export const isIndexedSelector = <T, TKey>(f: any): f is IndexedSelector<T, TKey> =>
  typeof f === 'function' && f.length > 0
