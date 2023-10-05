import isObj from './isObj'

export default function shouldUpdate(oldState: any, newState: any) {
  if (oldState === newState) return false

  if (isObj(oldState) && isObj(newState)) {
    for (let key in newState) {
      if (oldState[key] !== newState[key]) return true
    }
    return false
  }

  return true
}
