import React from 'react'


const EventsContext = React.createContext({
  events: {
    getState: () => {},
    subscribe: () => {},
    unsubscribe: () => {},
    dispatch: () => {},
  },
})


export default EventsContext
