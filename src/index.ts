import { useState, useEffect } from 'react'
import shouldUpdate from './utils/shouldUpdate'
import isFn from './utils/isFn'

type Store = any

type Reducer = (store: Store, action: any) => void

type Listener = {
  mapState: (store: any) => any
  updater: React.Dispatch<React.SetStateAction<any>>
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
    const oldStore = store

    if (reducer) {
      store = reducer(store, action)
    } else {
      store = isFn(action) ? action(store) : action
    }

    listeners.forEach(({ mapState, updater }) => {
      const oldState = mapState(oldStore)
      const newState = mapState(store)
      if (shouldUpdate(oldState, newState)) updater(() => newState)
    })
  }

  const useStore = (mapState = (store: Store) => store) => {
    const [, updater] = useState()

    useEffect(() => {
      const listener = {
        updater,
        mapState,
      }

      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    }, [mapState])

    return mapState(store)
  }

  return [useStore, dispatch, getStore]
}

export default createStore
