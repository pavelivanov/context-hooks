import React from 'react'


const StoreContext = React.createContext({
  getState: () => {},
  subscribe: () => {},
  unsubscribe: () => {},
  dispatch: () => {},
})


export default StoreContext
