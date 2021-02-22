export function toIterable<T, TF extends () => IterableIterator<T>>(f: TF) {
  return {
    [Symbol.iterator]: f,
    toJSON:function () {
      return [...f()]
    }
  }
}
