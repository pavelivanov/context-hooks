import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { StoreContext, EventsContext, createStore } from 'context-hooks'
import * as reducers from './reducers'
import App from './App'


const { store, events } = createStore(reducers)

const Root = () => (
  <Router>
    <StoreContext.Provider value={{ store }}>
      <EventsContext.Provider value={{ events }}>
        <App />
      </EventsContext.Provider>
    </StoreContext.Provider>
  </Router>
)


export default Root
