import React, { Fragment } from 'react'
import { Route, Link } from 'react-router-dom'
import { useConnect } from 'context-hooks'

import CounterPage from './pages/CounterPage'
import ProductsPage from './pages/ProductsPage'


const App = () => {
  console.log('Start render App')

  const { count } = useConnect((state) => ({
    count: state.counter.count,
  }))

  return (
    <Fragment>
      <ul>
        <li>
          <Link to="/counter">Counter {count}</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
      </ul>

      <hr />

      <Route exact path="/" component={CounterPage} />
      <Route exact path="/counter" component={CounterPage} />
      <Route exact path="/products" component={ProductsPage} />
    </Fragment>
  )
}


export default App
