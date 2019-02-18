import React, { Fragment } from 'react'
import { Route, Link } from 'react-router-dom'
import { useConnect } from 'context-hooks'

import CounterPage from './pages/CounterPage'
import ProductsPage from './pages/ProductsPage'
import SideComponent from './SideComponent'


const App = () => {
  console.log('render App')

  return (
    <Fragment>
      <ul>
        <li>
          <Link to="/counter">Counter</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
      </ul>

      <hr />

      <SideComponent />

      <Route exact path="/" component={CounterPage} />
      <Route exact path="/counter" component={CounterPage} />
      <Route exact path="/products" component={ProductsPage} />
    </Fragment>
  )
}


export default App
