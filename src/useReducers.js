import React, { useContext } from 'react'
import EventsContext from './EventsContext'


const useReducers = (reducers) => {
  const { dispatch } = useContext(EventsContext).events

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


export default useReducers
