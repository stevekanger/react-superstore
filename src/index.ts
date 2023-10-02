import { Reducer, Listener, SetStoreAction } from './types'
import { useState, useEffect } from 'react'
import shouldUpdate from './utils/shouldUpdate'

export default function createStore<TStore, TAction = SetStoreAction<TStore>>(
  initialStore: TStore,
  reducer?: Reducer<TStore, TAction>
) {
  let store: TStore = initialStore
  const listeners = new Set<Listener<TStore>>()

  // Next 2 lines are stupid typescript BS to infer types using overloads.
  function useStore(): TStore
  function useStore<T>(selectorFn: (store: TStore) => T): T

  function useStore(selectorFn = (store: TStore) => store) {
    const [, updater] = useState<any>(store)

    useEffect(() => {
      const listener = {
        updater,
        selectorFn,
      }

      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    }, [])

    return selectorFn(store)
  }

  function setStore(action: TAction) {
    const oldStore = store

    if (reducer) {
      store = reducer(store, action)
    } else {
      store = action instanceof Function ? action(store) : action
    }

    listeners.forEach(({ selectorFn, updater }: Listener<TStore>) => {
      const oldState = selectorFn(oldStore)
      const newState = selectorFn(store)
      if (shouldUpdate(oldState, newState)) updater(() => newState)
    })
  }

  function getStore() {
    return store
  }

  return [useStore, setStore, getStore] as const
}
