export interface GroupedIterable<K, V> extends Iterable<V> {
  key: K;
  toJSON(): Array<V>;
}
