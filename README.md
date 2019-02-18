# context-hooks

React Hooks for accessing state and dispatch from a store


### Usage examples

#### Counter

```jsx
import { StoreContext, createStore, useReducers, useConntect } from 'context-hooks'

const counter = {
    initialState: {
        count: 0,
    },
    increase = (state) => ({ count: state.count + 1 }),
    decrease = (state) => ({ count: state.count - 1 }),
}

const App = () => {
    const { counter } = useReducers({ counter })

    const state = useConntect((state) => ({
        count: state.counter.count,
    }))

    return (
        <Fragment>
            Count: {count}<br />

            <button onClick={() => counter.increase()}>increase count</button>
            <button onClick={() => counter.decrease()}>decrease count</button>
        </Fragment>
    )
}

const reducers = { counter }
const store = createStore(reducers)

const Root = () => (
    <StoreContext.Provider value={store}>
        <App />
    </StoreContext.Provider>
)
```
