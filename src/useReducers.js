import React, { useContext } from 'react'

import StoreContext from './StoreContext'
import devTools from './devTools'


const useReducers = (reducers) => {
  const store = useContext(StoreContext)

  return Object.keys(reducers).reduce((acc, reducerName) => ({
    ...acc,
    [reducerName]: (
      Object.keys(reducers[reducerName])
        .filter((methodName) => methodName !== 'initialState')
        .reduce((acc, methodName) => ({
          ...acc,
          [methodName]: (payload) => {
            const type = `${reducerName}.${methodName}`

            store.dispatch({ type, payload })
            devTools.dispatch({ type, payload })
          },
        }), {})
    ),
  }), {})
}


export default useReducers
