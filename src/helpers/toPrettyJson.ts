export const toPrettyJson = (() => {
  const isIterable = (obj: any) =>
    obj != null &&
    !Array.isArray(obj) &&
    typeof obj !== 'string' &&
    typeof obj[Symbol.iterator] === 'function'
  const replacer = (_: string, v: any) => (isIterable(v) ? [...v] : v)
  return (obj: any) => JSON.stringify(obj, replacer, 2)
})()
