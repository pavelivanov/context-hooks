import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { StoreContext, createStore } from 'context-hooks'
import * as reducers from './reducers'
import App from './App'


const store = createStore(reducers)

const Root = () => (
  <Router>
    <StoreContext.Provider value={store}>
      <App />
    </StoreContext.Provider>
  </Router>
)


export default Root
