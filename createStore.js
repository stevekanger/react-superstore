import { useState, useEffect, useLayoutEffect } from 'react'

const effect = typeof window === 'undefined' ? useEffect : useLayoutEffect
const isFn = (fn) => typeof fn === 'function'
const isObj = (obj) =>
  typeof obj === 'object' && typeof obj !== 'function' && obj !== null

const shouldUpdate = (state, newState) => {
  if (state === newState) return false

  if (isObj(state) && isObj(newState)) {
    for (let key in newState) {
      if (state[key] !== newState[key]) return true
    }
    return false
  }

  return true
}

const createStore = (initialStore, reducer) => {
  let store = initialStore
  const listeners = new Set()

  const getStore = () => store

  const dispatch = (action) => {
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

  const useStore = (mapState = (store) => store) => {
    const [, updater] = useState()
    const state = mapState(store)

    effect(() => {
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
