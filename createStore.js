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

const createStore = (initialStore, reducer) => {
  let store = initialStore
  const listeners = new Set()

  const getStore = () => store

  const dispatch = (action) => {
    const oldStore = store

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

    return store
  }

  return { useStore, getStore, dispatch }
}

export default createStore
