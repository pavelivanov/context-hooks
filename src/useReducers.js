import React, { useContext } from 'react'

import StoreContext from './StoreContext'


const useReducers = () => {
  const store = useContext(StoreContext)

  return store.dispatchedReducers
}


export default useReducers
