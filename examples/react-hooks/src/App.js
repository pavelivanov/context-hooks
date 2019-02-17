import React, { Fragment } from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import { useConnect } from './store/lib'

import CounterPage from './pages/CounterPage'
import ProductsPage from './pages/ProductsPage'


const useData = () => useConnect({
  count: 'counter.count',
})

const App = () => {
  console.log('Start render App')

  const { count } = useData()

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
