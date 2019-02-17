import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { StoreContext, EventsContext } from './store/lib'
import { createStore } from './store'

import App from './App'


const store   = createStore({
  counter: {
    count: 1,
  }
})
const events  = {
  getState: store.getState.bind(store),
  subscribe: store.subscribe.bind(store),
  unsubscribe: store.unsubscribe.bind(store),
  dispatch: store.dispatch.bind(store)
}

const Root = () => (
  <Router>
    <StoreContext.Provider value={{ store }}>
      <EventsContext.Provider value={events}>
        <App />
      </EventsContext.Provider>
    </StoreContext.Provider>
  </Router>
)


export default Root
