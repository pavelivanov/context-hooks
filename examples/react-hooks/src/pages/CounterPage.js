import React from 'react'
import { useReducers, useConnect } from '../store/lib'
import { counter } from '../store/reducers'


const useData = () => useConnect({
  count: 'counter.count',
})

const CounterPage = () => {
  console.log('Start render CounterPage')

  const { count } = useData()
  const reducers = useReducers({ counter })

  return (
    <div>
      Count: {count}<br /><br />
      <button onClick={() => reducers.counter.increment()}>increment</button><br />
      <button onClick={() => reducers.counter.decrement()}>decrement</button>
    </div>
  )
}


export default CounterPage
