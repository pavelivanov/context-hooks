import devTools from './devTools'


const dispatchReducers = (store, reducers) =>
  Object.keys(reducers).reduce((acc, reducerName) => ({
    ...acc,
    [reducerName]: (
      Object.keys(reducers[reducerName])
        .filter((methodName) => methodName !== 'initialState')
        .reduce((acc, methodName) => ({
          ...acc,
          [methodName]: (payload) => {
            const type = `${reducerName}.${methodName}`

            store.dispatch({ type, payload })
            devTools.dispatch({ type, payload })
          },
        }), {})
    ),
  }), {})

class Store {

  constructor(reducers, initialState) {
    this.state                = initialState || {}
    this.reducers             = reducers
    this.listeners            = { root: [] /* , [reducerName]: [ ...handlers ] */ }
    this.dispatchedReducers   = dispatchReducers(this, reducers)
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

  /**
   *
   * @param {Object} values
   * @param {string} values.type
   * @param {Function} values.payload
   */
  dispatch({ type, payload }) {
    const [ reducerName, methodName ] = type.split('.')

    const currState = this.state[reducerName]
    const nextState = this.reducers[reducerName][methodName](currState, payload)

    this.state = {
      ...this.state,
      [reducerName]: nextState,
    }

    // call all handlers that was created from {Function} mapStateToProps
    this.listeners['root'].forEach((handler) => {
      handler(this.state)
    })

    if (this.listeners[reducerName]) {
      this.listeners[reducerName].forEach((handler) => {
        handler(nextState)
      })
    }
  }
}

/**
 *
 * @param {Object} reducers
 */
const collectInitialStateFromReducers = (reducers) =>
  Object.keys(reducers).reduce((state, reducerName) => {
    const { initialState } = reducers[reducerName]

    if (!initialState) {
      throw new Error(`"initialState" required in "${reducerName}" reducer.`)
    }

    return { ...state, [reducerName]: initialState }
  }, {})

/**
 *
 * @param {Object} reducers
 * @param {Object} [initialState]
 * @returns {Store}
 */
const createStore = (reducers, initialState = {}) => {
  const _initialState = {
    ...collectInitialStateFromReducers(reducers),
    ...initialState
  }

  devTools.createStore(reducers, _initialState)

  return new Store(reducers, _initialState)
}


export default createStore
