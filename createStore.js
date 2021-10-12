import { useState, useEffect, useLayoutEffect } from 'react'

const isFn = (fn) => typeof fn === 'function'
const effect = typeof window === 'undefined' ? useEffect : useLayoutEffect

const createStore = (initialState, reducer) => {
  let state = initialState
  const listeners = new Set()

  const setState = (action) => {
    let oldState = state

    if (reducer) {
      state = reducer(state, action)
    } else {
      state = isFn(action) ? action(state) : action
    }

    const checkKeys = (keys) => {
      if (keys === false) return false
      if (!keys) return true
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] in state && state[keys[i]] !== oldState[keys[i]]) {
          return true
        }
      }

      return false
    }

    if (state !== oldState) {
      listeners.forEach(({ keys, fire }) => {
        if (checkKeys(keys)) fire(state)
      })
    }
  }

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

    return [state, setState]
  }
}

export default createStore
