import React, { useReducer } from 'react'


/**
 *
 * @param {Object} methods
 * @param {Function} dispatch
 */
const dispatchMethods = (methods, dispatch) =>
  Object.keys(methods).reduce((result, methodName) => ({
    ...result,
    [methodName]: (payload) => dispatch({ type: methodName, payload }),
  }), {})

/**
 *
 * @param {Object} params
 * @param {Object} params.initialState
 * @param {Object} params.methods
 * @param {Function} [modifyInitialState]
 * @return {[ Object, Object ]}
 */
const useDispatchedReducer = ({ initialState, ...methods }, modifyInitialState) => {
  const reducer = (state, { type, payload }) => methods[type](state, payload)

  const [ state, dispatch ] = useReducer(reducer, initialState, modifyInitialState)

  const actions = dispatchMethods(methods, dispatch)

  return [ state, actions ]
}
