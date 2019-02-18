import React from 'react'
import { useConnect } from 'context-hooks'


const SideComponent = () => {
  console.log('render SideComponent')

  const { count } = useConnect((state) => ({
    count: state.counter.count,
  }))

  return (
    <div>
      <b>Side component</b> count: {count}
    </div>
  )
}


export default SideComponent
