export default function isObj(obj: {}) {
  return typeof obj === 'object' && !Array.isArray(obj) && obj !== null
}
