const isObj = (obj: {}) =>
  typeof obj === 'object' && !Array.isArray(obj) && obj !== null

export default isObj
