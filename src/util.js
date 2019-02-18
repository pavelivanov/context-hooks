const compose = (...funcs) => {
  if (funcs.length === 0) {
    return (arg) => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((prev, next) => (...args) => {
    console.log('prev', prev)
    console.log('next', next)
    console.log('next.apply', next.apply)
    console.log('args', args)

    return prev(next(...args))
  })
}

const applyMiddleware = (...middlewares) => {
  return (createStore) => (...args) => {
    const store = createStore(...args)

    let dispatch = (...args) => {
      console.log('dispatched', args)
    }

    const middlewareAPI = {
      getState: store.getState.bind(store),
      dispatch: (...args) => dispatch(...args)
    }

    const chain = middlewares.map((middleware) => middleware(middlewareAPI))

    dispatch = compose(...chain)(store.dispatch.bind(store))

    return dispatch
  }
}


export {
  compose,
  applyMiddleware,
}
