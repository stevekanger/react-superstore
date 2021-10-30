import { useState, useEffect, useLayoutEffect } from 'react'

const effect = typeof window === 'undefined' ? useEffect : useLayoutEffect
const isFn = (fn) => typeof fn === 'function'

const checkKeys = (keys, store, oldStore) => {
  if (keys.length < 1) return true

  for (let i = 0; i < keys.length; i++) {
    if (store[keys[i]] !== oldStore[keys[i]]) return true
  }

  return false
}

const mapActions = (actions = {}, dispatch, getStore) => {
  const mappedActions = {}

  Object.keys(actions).forEach((key) => {
    if (isFn(actions[key])) {
      mappedActions[key] = actions[key](dispatch, getStore)
    }
  })

  return mappedActions
}

const createStore = (initialStore, reducer, actions) => {
  let store = initialStore
  const listeners = new Set()

  const getStore = () => store

  const dispatch = (action) => {
    let oldStore = store

    if (reducer) {
      store = reducer(store, action)
    } else {
      store = isFn(action) ? action(store) : action
    }

    if (store === oldStore) return

    listeners.forEach(({ keys, fire }) => {
      if (checkKeys(keys, store, oldStore)) fire(() => store)
    })
  }

  const mappedActions = mapActions(actions, dispatch, getStore)

  const useStore = (...keys) => {
    const [, fire] = useState()

    effect(() => {
      const listener = {
        keys,
        fire,
      }
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    }, [])

    return [store, dispatch, mappedActions]
  }

  return useStore
}

export default createStore
