const isObj = (obj: {}) =>
  typeof obj === 'object' &&
  typeof obj !== 'function' &&
  !Array.isArray(obj) &&
  obj !== null

export default isObj
