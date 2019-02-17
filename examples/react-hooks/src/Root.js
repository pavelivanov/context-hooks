import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { StoreContext, EventsContext, createStore } from 'context-hooks'
import App from './App'


const { store, events } = createStore({
  counter: {
    count: 1,
  }
})

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
