import { createStore as createHookedStore } from './lib'
import * as reducers from './reducers'


const createStore = (initialState) => {
  return createHookedStore(initialState)
}


export {
  createStore,
}

