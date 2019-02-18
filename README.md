# context-hooks

> React Hooks for accessing state and dispatch from a store

[![Npm Version](https://badge.fury.io/js/context-hooks.svg)](https://www.npmjs.com/package/context-hooks)
[![Month Downloads](https://img.shields.io/npm/dm/context-hooks.svg)](http://npm-stat.com/charts.html?package=context-hooks)
[![Bundle Size](https://badgen.net/bundlephobia/minzip/context-hooks@latest)](https://bundlephobia.com/result?p=context-hooks@latest)


## Install

```bash
# Yarn
yarn add context-hooks

# NPM
npm install --save context-hooks
```

## Quick Start

```jsx
// bootstrap your app

import { StoreContext, createStore } from 'context-hooks'

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <App />
  </StoreContext.Provider>,
  document.getElementById('root'),
)
```

```jsx
// individual components

import { useReducers, useConntect } from 'context-hooks'

const App = () => {
  const state = useConntect((state) => ({
    count: state.counter.count,
  }))
  
  const { counter } = useReducers()

  return (
    <Fragment>
      Count: {count}<br />

        <button onClick={() => counter.increase()}>increase count</button>
        <button onClick={() => counter.decrease()}>decrease count</button>
    </Fragment>
  )
}
```

## Usage

NOTE: React hooks require `react` and `react-dom` version `16.8.0` or higher.

## Example

```js
// reducers

export default {
  counter: {
    initialState: {
      count: 0,
    },
    increase = (state) => ({ count: state.count + 1 }),
    decrease = (state) => ({ count: state.count - 1 }),
  },
}
```

```jsx
// bootstrap your app

import { StoreContext, createStore } from 'context-hooks'
import reducers from './reducers'

const store = createStore(reducers)

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <App />
  </StoreContext.Provider>,
  document.getElementById('root'),
)
```

```jsx
// individual components

import { useReducers, useConntect } from 'context-hooks'

const App = () => {
  const state = useConntect((state) => ({
    count: state.counter.count,
  }))
  
  const { counter } = useReducers()

  return (
    <Fragment>
      Count: {count}<br />

        <button onClick={() => counter.increase()}>increase count</button>
        <button onClick={() => counter.decrease()}>decrease count</button>
    </Fragment>
  )
}
```
