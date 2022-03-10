import { useState } from 'react'
import shouldUpdate from './utils/shouldUpdate'
import isFn from './utils/isFn'
import useAvailableEffect from './utils/useAvailableEffect'

type Store = any

type Reducer = (store: Store, action: any) => void

type Listener = {
  mapState: (store: any) => any
  updater: React.Dispatch<React.SetStateAction<any>>
  state: any
}

type ReturnedFunctions = [
  (store?: Store) => any,
  (action: any) => void,
  () => Store
]

const createStore = (
  initialStore: Store,
  reducer?: Reducer
): ReturnedFunctions => {
  let store: Store = initialStore
  const listeners = new Set<Listener>()

  const getStore = () => store

  const dispatch = (action: any) => {
    if (reducer) {
      store = reducer(store, action)
    } else {
      store = isFn(action) ? action(store) : action
    }

    listeners.forEach(({ state, mapState, updater }) => {
      const newState = mapState(store)
      if (shouldUpdate(state, newState)) updater(() => newState)
    })
  }

  const useStore = (mapState = (store: Store) => store) => {
    const [, updater] = useState()
    const state = mapState(store)

    useAvailableEffect(() => {
      const listener = {
        updater,
        state,
        mapState,
      }

      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    }, [state, mapState])

    return state
  }

  return [useStore, dispatch, getStore]
}

export default createStore
