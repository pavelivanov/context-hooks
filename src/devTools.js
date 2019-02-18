let store = {
  dispatch: () => {},
}

const createStore = (reducers, initialState) => {
  if (typeof window !== 'undefined' && window.devToolsExtension) {
    const reducer = (state, { type, payload }) => {
      const [ reducerName, methodName ] = type.split('.')

      if (reducers.hasOwnProperty(reducerName)) {
        return {
          ...state,
          [reducerName]: reducers[reducerName][methodName](state[reducerName], payload),
        }
      }

      return state
    }

    store = window.devToolsExtension(reducer, initialState)
  }
}

const dispatch = (...args) => store.dispatch(...args)


export default {
  createStore,
  dispatch,
}
