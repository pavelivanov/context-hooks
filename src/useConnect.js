import React, { useState, useContext, useEffect, useReducer, useRef } from 'react'
import StoreContext from './StoreContext'


const getIn = (obj, arrPath) => {
  const [ key, ...restPath ] = arrPath

  if (!restPath.length) {
    return obj[key]
  }

  return getIn(obj[key], restPath)
}

const lookup = (state, propMap) => {
  if (typeof propMap === 'function') {
    return propMap(state)
  }

  if (typeof propMap === 'string') {
    return getIn(state, propMap.split('.'))
  }

  throw new Error(`Unknown lookup value: ${propMap}`)
}

const mapStateToProps = (state, propsMap) => {
  if (typeof propsMap === 'function') {
    return propsMap(state)
  }

  return Object.keys(propsMap).reduce((res, propName) => ({
    ...res,
    [propName]: lookup(state, propsMap[propName]),
  }), {})
}


/**
 *
 * @param {Object} initialState
 * @param {Function|string} propsMap
 * @returns {function(*=)}
 */
const createListener = (initialState, propsMap) => {
  let prevValue = lookup(initialState, propsMap)

  return (newState) => {
    const newValue  = lookup(newState, propsMap)
    const isEqual   = JSON.stringify(prevValue) === JSON.stringify(newValue) // TODO replace this with memo

    prevValue = newValue

    return !isEqual
  }
}

const createListeners = (store, propsMap) => {
  const initialState = store.getState()
  const listeners = { root: [] }

  Object.keys(propsMap).forEach((propName) => {
    const propMap = propsMap[propName]

    if (typeof propMap === 'function') {
      listeners.root.push(createListener(initialState, propMap))
    }
    else if (typeof propMap === 'string') {
      const [ reducerName, ...path ] = propMap.split('.')

      if (!listeners[reducerName]) {
        listeners[reducerName] = []
      }

      const listener = createListener(initialState[reducerName], path.join('.'))

      listeners[reducerName].push(listener)
    }
    else {
      throw new Error(`Invalid prop "${propName}" of type "${typeof propMap}" supplied to "useConnect", expected "string" or "function".`)
    }
  })

  return listeners
}

const createChangeHandler = (ref, listener) => (newState) => {
  const isChanged = listener(newState)

  if (isChanged) {
    ref.current.forceUpdate()
  }
}

const useForceUpdate = () => useReducer((state) => !state, false)[1]

const useListeners = (store, propsMap) => {
  const ref           = useRef()
  const isFirstRender = !ref.current
  const forceUpdate   = useForceUpdate()

  if (isFirstRender) {
    ref.current = {
      forceUpdate: () => {},
      handlers: [],
    }
  }

  // update state setter on each render to allow listeners has access to the last created scope
  ref.current.forceUpdate = () => forceUpdate()

  if (isFirstRender) {
    if (typeof propsMap === 'function') {
      const listener  = createListener(store.getState(), propsMap)
      const handler   = createChangeHandler(ref, listener)

      ref.current.handlers.push({ key: 'root', handler })
      store.subscribe('root', handler)
    }
    else {
      const listeners = createListeners(store, propsMap)

      Object.keys(listeners).forEach((reducerName) => {
        const handler = createChangeHandler(ref, (newState) => listeners[reducerName].some((listener) => listener(newState)))

        ref.current.handlers.push({ key: reducerName, handler })
        store.subscribe(reducerName, handler)
      })
    }
  }

  useEffect(() => () => {
    ref.current.handlers.forEach(({ key, handler }) => {
      store.unsubscribe(key, handler)
    })

    delete ref.current
  }, [])
}

const useConnect = (propsMap) => {
  const store = useContext(StoreContext)

  useListeners(store, propsMap)

  // TODO looks like there is a problem with correct store state on rerender
  return mapStateToProps(store.getState(), propsMap)
}


export default useConnect
