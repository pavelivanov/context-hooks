import React, { useState, useContext, useEffect } from 'react'
import EventsContext from './EventsContext'


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


const getUniqueId = ((id) => () => String(++id))(1)
const ductapeRenderId = {}

const useConnect = (storeProps) => {
  const { getState, subscribe, unsubscribe } = useContext(EventsContext).events
  const [ connectId ] = useState(getUniqueId())
  const [ renderId, setRenderId ] = useState(0)

  ductapeRenderId[connectId] = () => setRenderId(renderId + 1)

  const initialState = getState()

  useEffect(() => {
    const listeners = {}

    if (typeof storeProps === 'function') {
      let prevValue = mapStateToProps(initialState, storeProps)

      listeners['root'] = (newState) => {
        const newValue = mapStateToProps(newState, storeProps)

        // TODO replace this with memo
        if (JSON.stringify(prevValue) !== JSON.stringify(newValue)) {
          ductapeRenderId[connectId]()
        }

        prevValue = newValue
      }
    }
    else {
      Object.keys(storeProps).forEach((propName) => {
        const pathToState = storeProps[propName]
        const [ reducerName, ...path ] = pathToState.split('.')

        let prevValue = getIn(initialState[reducerName], path)

        listeners[reducerName] = (newState) => {
          const newValue = getIn(newState, path)

          if (prevValue !== newValue) {
            ductapeRenderId[connectId]()
          }

          prevValue = newValue
        }
      })
    }

    Object.keys(listeners).forEach((reducerName) => {
      subscribe(reducerName, listeners[reducerName])
    })

    return () => {
      delete ductapeRenderId[connectId]

      Object.keys(listeners).forEach((reducerName) => {
        unsubscribe(reducerName, listeners[reducerName])
      })
    }
  }, [])

  return mapStateToProps(initialState, storeProps)
}


export default useConnect
