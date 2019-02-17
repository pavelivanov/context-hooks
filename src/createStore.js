class Store {

  constructor(initialState) {
    this.state = initialState || {}
    this.listeners = {
      root: [],
      // ...reducerName: [ ...handlers ]
    }
  }

  getState() {
    return this.state
  }

  has(reducerName, handler) {
    return this.listeners[reducerName] && this.listeners[reducerName].includes(handler)
  }

  subscribe(reducerName, handler) {
    if (!this.listeners[reducerName]) {
      this.listeners[reducerName] = []
    }

    if (!this.has(reducerName, handler)) {
      this.listeners[reducerName].push(handler)
    }
  }

  unsubscribe(reducerName, handler) {
    if (this.has(reducerName, handler)) {
      const handlerIndex = this.listeners[reducerName].indexOf(handler)

      this.listeners[reducerName].splice(handlerIndex, 1)
    }
  }

  dispatch({ reducerName, method }) {
    const currState = this.state[reducerName]
    const newState  = method(currState)

    this.state = {
      ...this.state,
      [reducerName]: newState,
    }

    this.listeners['root'].forEach((handler) => {
      handler(this.state)
    })

    Object.keys(this.listeners).forEach((_reducerName) => {
      const handlers = this.listeners[_reducerName]

      handlers.forEach((handler) => {
        if (reducerName === _reducerName) {
          handler(newState)
        }
      })
    })
  }
}


const getInitialStateFromReducers = (reducers) =>
  Object.keys(reducers).reduce((state, reducerName) => {
    const { initialState } = reducers[reducerName]

    if (!initialState) {
      throw new Error(`"initialState" required in "${reducerName}" reducer.`)
    }

    return { ...state, [reducerName]: initialState }
  }, {})

const createStore = (reducers, initialState = {}) => {
  const initialStateFromReducers = getInitialStateFromReducers(reducers)

  const store = new Store({ ...initialStateFromReducers, ...initialState })

  const events = {
    getState: store.getState.bind(store),
    subscribe: store.subscribe.bind(store),
    unsubscribe: store.unsubscribe.bind(store),
    dispatch: store.dispatch.bind(store)
  }

  return { store, events }
}


export default createStore
