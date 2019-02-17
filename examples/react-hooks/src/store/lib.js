import React, { useState, useEffect, useReducer, useContext } from 'react'


const StoreContext = React.createContext({
  store: {},
})

const EventsContext = React.createContext({
  getState: () => {},
  subscribe: () => {},
  unsubscribe: () => {},
  dispatch: () => {},
})


class Store {

  constructor(initialState) {
    this.state = initialState || {}
    this.listeners = {} // pathToState => handler[]
  }

  getState() {
    return this.state
  }

  has(reducerName, handler) {
    return this.listeners[reducerName] && this.listeners[reducerName].includes(handler)
  }

  subscribe(reducerName, handler) {
    if (!this.listeners[reducerName]) {
      this.listeners[reducerName] = []
    }

    if (!this.has(reducerName, handler)) {
      this.listeners[reducerName].push(handler)
    }
  }

  unsubscribe(reducerName, handler) {
    if (this.has(reducerName, handler)) {
      const handlerIndex = this.listeners[reducerName].indexOf(handler)

      this.listeners[reducerName].splice(handlerIndex, 1)
    }
  }

  dispatch({ reducerName, method }) {
    const currState = this.state[reducerName]
    const newState  = method(currState)

    this.state = {
      ...this.state,
      [reducerName]: newState,
    }

    Object.keys(this.listeners).forEach((reducer) => {
      const handlers = this.listeners[reducer]

      handlers.forEach((handler) => {
        if (reducerName === reducer) {
          handler(newState)
        }
      })
    })
  }
}


const createStore = (initialState) => {
  return new Store(initialState)
}


const useReducers = (reducers) => {
  const { dispatch } = useContext(EventsContext)

  return Object.keys(reducers).reduce((acc, reducerName) => ({
    ...acc,
    [reducerName]: (
      Object.keys(reducers[reducerName])
        .filter((methodName) => methodName !== 'initialState')
        .reduce((acc, methodName) => ({
          ...acc,
          [methodName]: (payload) => {
            const method = (state) => reducers[reducerName][methodName](state, payload)

            dispatch({ reducerName, method })
          },
        }), {})
    ),
  }), {})
}


const getIn = (obj, arrPath) => {
  const [ key, ...restPath ] = arrPath

  if (restPath) {
    return obj[key]
  }

  return getIn(obj[key], restPath)
}

const resolveStoreProps = (state, path) => {
  const paths = path.split('.')
  let current = state
  let i

  for (i = 0; i < paths.length; ++i) {
    if (current[paths[i]] === undefined) {
      return undefined
    }
    current = current[paths[i]]
  }

  return current
}

const lookup = (state, keyValue) => {
  if (typeof keyValue === 'function') return keyValue(state)
  if (typeof keyValue === 'string') return resolveStoreProps(state, keyValue)
  throw new Error(`Unknown lookup value: ${keyValue}`)
}

const resolveMapStateToProps = (state, storeProps) => {
  const resolved = {}

  for (let key in storeProps) {
    if (storeProps.hasOwnProperty(key)) {
      resolved[key] = lookup(state, storeProps[key])
    }
  }

  return resolved
}

const mapStateToProps = (state, storeProps) => {
  if (typeof storeProps === 'function') {
    return storeProps(state)
  }

  return resolveMapStateToProps(state, storeProps)
}

const useConnect = (storeProps) => {
  const { getState, subscribe, unsubscribe } = useContext(EventsContext)
  const [ _id, _setState ] = useState(0)

  const initialState = getState()

  const state = mapStateToProps(initialState, storeProps)

  useEffect(() => {
    const listeners = {}

    Object.keys(storeProps).forEach((propName) => {
      const pathToState = storeProps[propName]
      const [ reducerName, ...path ] = pathToState.split('.')

      let prevValue = getIn(initialState[reducerName], path)

      listeners[reducerName] = (newState) => {
        const value = getIn(newState, path)

        if (prevValue !== value) {
          _setState(_id + 1)
        }

        prevValue = value
      }
    })

    Object.keys(listeners).forEach((reducerName) => {
      subscribe(reducerName, listeners[reducerName])
    })

    return () => {
      Object.keys(listeners).forEach((reducerName) => {
        unsubscribe(reducerName, listeners[reducerName])
      })
    }
  })

  return state
}


export {
  StoreContext,
  EventsContext,
  createStore,
  useReducers,
  useConnect,
}

