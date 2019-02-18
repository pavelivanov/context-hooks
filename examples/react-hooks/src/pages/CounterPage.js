import React from 'react'
import { useReducers, useConnect } from 'context-hooks'


const CounterPage = () => {
  console.log('Start render CounterPage')

  const { count } = useConnect({
    count: 'counter.count',
  })

  const { counter } = useReducers()

  return (
    <div>
      Count: {count}<br /><br />
      <button onClick={() => counter.increment()}>increment</button><br />
      <button onClick={() => counter.decrement()}>decrement</button>
    </div>
  )
}


export default CounterPage
