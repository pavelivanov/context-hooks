import React, { useState, useContext, useEffect } from 'react'
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


const getUniqueId = ((id) => () => String(++id))(1)
const renderConnectors = {}

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

  if (typeof propsMap === 'function') {
    listeners.root.push(createListener(initialState, propsMap))
  }
  else {
    Object.keys(propsMap).forEach((propName) => {
      const propMap   = propsMap[propName]

      if (typeof propMap === 'function' || typeof propMap === 'string') {
        listeners.root.push(createListener(initialState, propMap))
      }
      else if (typeof propMap === 'string') {
        const [ reducerName, ...path ] = propMap.split('.')

        listeners[reducerName] = createListener(initialState[reducerName], path.join('.'))
      }
      else {
        throw new Error(`Invalid prop "${propName}" of type "${typeof propMap}" supplied to "useConnect", expected "string" or "function".`)
      }
    })
  }

  return listeners
}

const useListeners = (store, propsMap) => {
  const [ connectId ] = useState(getUniqueId())
  const [ renderId, setRenderId ] = useState(0)

  // update state setter on each render to allow listeners has access to the last created scope
  renderConnectors[connectId] = () => setRenderId(renderId + 1)

  useEffect(() => {
    const { root: rootListeners, ...reducerListeners } = createListeners(store, propsMap)
    const handlers = []

    if (rootListeners.length) {
      const handler = (newState) => {
        const isChanged = rootListeners.some((handler) => handler(newState))

        if (isChanged) {
          renderConnectors[connectId]()
        }
      }

      handlers.push({ key: 'root', handler })
      store.subscribe('root', handler)
    }

    Object.keys(reducerListeners).forEach((reducerName) => {
      const handler = (newState) => {
        const isChanged = reducerListeners[reducerName](newState)

        if (isChanged) {
          renderConnectors[connectId]()
        }
      }

      handlers.push({ key: reducerName, handler })
      store.subscribe(reducerName, handler)
    })

    return () => {
      delete renderConnectors[connectId]

      handlers.forEach(({ key, handler }) => {
        store.unsubscribe(key, handler)
      })
    }
  }, [])
}

const useConnect = (propsMap) => {
  const store = useContext(StoreContext)

  useListeners(store, propsMap)

  // TODO looks like there is a problem with correct store state on rerender
  return mapStateToProps(store.getState(), propsMap)
}


export default useConnect
