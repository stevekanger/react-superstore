import { useState, useEffect } from 'react'
import shouldUpdate from './utils/shouldUpdate'
import isFn from './utils/isFn'

type Reducer<TStore> = <TAction>(store: TStore, action: TAction) => TStore

type Listener<TStore> = {
  mapState: (store: TStore) => TStore
  updater: React.Dispatch<React.SetStateAction<TStore>>
}

const createStore = <TStore>(
  initialStore: TStore,
  reducer?: Reducer<TStore>
) => {
  let store: TStore = initialStore
  const listeners = new Set<Listener<TStore>>()

  const getStore = () => store

  const dispatch = (action: TStore | ((prev: TStore) => TStore)) => {
    const oldStore = store

    if (reducer) {
      store = reducer(store, action)
    } else {
      // @ts-expect-error[2349]
      store = isFn(action) ? action(store) : action
    }

    listeners.forEach(({ mapState, updater }) => {
      const oldState = mapState(oldStore)
      const newState = mapState(store)
      if (shouldUpdate(oldState, newState)) updater(() => newState)
    })
  }

  const useStore = (mapState = (s: TStore) => s) => {
    const [, updater] = useState<TStore>()

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

  return [useStore, dispatch, getStore] as const
}

export default createStore
