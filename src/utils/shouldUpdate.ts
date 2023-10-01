import isObj from './isObj'

const shouldUpdate = (state: any, newState: any) => {
  if (state === newState) return false

  if (isObj(state) && isObj(newState)) {
    for (let key in newState) {
      if (state[key] !== newState[key]) return true
    }
    return false
  }

  return true
}

export default shouldUpdate
