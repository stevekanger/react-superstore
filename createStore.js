import { useState, useEffect, useLayoutEffect } from 'react'

const isFn = (fn) => typeof fn === 'function'
const effect = typeof window === 'undefined' ? useEffect : useLayoutEffect

const createStore = (initialStore, reducer, passedActions) => {
  let store = initialStore
  const listeners = new Set()
  const getStore = () => store

  const setStore = (action) => {
    let oldStore = store
    if (reducer) {
      store = reducer(store, action)
    } else {
      store = isFn(action) ? action(store) : action
    }
    const checkKeys = (keys) => {
      if (!keys) return true
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] in store && store[keys[i]] !== oldStore[keys[i]]) {
          return true
        }
      }
      return false
    }
    if (store !== oldStore) {
      listeners.forEach(({ keys, fire }) => {
        if (checkKeys(keys)) fire(() => store)
      })
    }
  }

  const createActions = () => {
    const mappedActions = {}
    if (passedActions) {
      Object.keys(passedActions).forEach((key) => {
        if (isFn(passedActions[key])) {
          mappedActions[key] = passedActions[key](getStore, setStore)
        }
      })
    }
    return mappedActions
  }

  const actions = createActions()

  return (keys) => {
    const listener = {
      keys,
      fire: useState()[1],
    }
    effect(() => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    }, [listener])

    return [store, setStore, actions]
  }
}

export default createStore
